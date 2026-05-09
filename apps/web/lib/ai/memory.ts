import 'server-only';
import { embed } from '@crmos360/ai';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPdpaSettings } from '@/lib/pdpa';
import { recordAction } from '@/lib/audit';
import { harnessGenerateStructured } from './harness';
import { detectAndResolveConflict, findSimilarMemoriesForCustomer } from './memory-engine';

/**
 * Memory writer (M1.4 → memory v2).
 *
 * Pipeline on each conversation turn:
 *   1. Extract candidate facts from inbound messages (LLM, JSON-validated).
 *   2. Hand each candidate to the memory engine to detect contradictions
 *      with stored facts about the same customer; loser gets marked
 *      'contradicted' and superseded.
 *   3. Write to customer_memory or pending_facts based on PDPA mode.
 *      Each new row carries an explicit confidence so downstream scoring
 *      and decay can prune low-quality memories over time.
 */

interface ExtractedFact {
  kind: string;
  content: string;
  confidence: number;
}

const EXTRACTION_PROMPT = `You are an information extraction model. From the customer's recent messages,
extract DURABLE FACTS that would help personalize FUTURE replies.

For each fact, score confidence 0.0–1.0:
  - 0.9+ : explicitly stated by customer ("ฉันแพ้ paraben")
  - 0.7  : strongly implied by repeated behavior or wording
  - 0.5  : possible but not certain
  - <0.5 : do not include

Reply strictly as JSON array, max 5 items:
[{"kind":"fact|preference|complaint|tone|allergy|location","content":"<short phrase>","confidence":0.85}]

Return [] if nothing durable.`;

interface ExtractArgs {
  orgId: string;
  conversationId: string;
}

const RECENT_MESSAGE_LIMIT = 8;
const MIN_CONFIDENCE_TO_STORE = 0.5;

function validateFacts(raw: unknown): ExtractedFact[] | null {
  if (!Array.isArray(raw)) return null;
  const out: ExtractedFact[] = [];
  for (const item of raw) {
    if (typeof item !== 'object' || item === null) continue;
    const o = item as Record<string, unknown>;
    if (typeof o.kind !== 'string' || typeof o.content !== 'string') continue;
    const conf = typeof o.confidence === 'number' ? o.confidence : 0.6;
    out.push({
      kind: o.kind.slice(0, 30),
      content: o.content.slice(0, 500),
      confidence: Math.min(1, Math.max(0, conf)),
    });
  }
  return out;
}

export async function extractAndStoreMemory(args: ExtractArgs): Promise<number> {
  if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) return 0;

  const admin = createAdminClient();

  const { data: convo } = await admin
    .from('conversations')
    .select('customer_id')
    .eq('id', args.conversationId)
    .maybeSingle();

  if (!convo?.customer_id) return 0;
  const customerId = convo.customer_id as string;

  const { data: rows } = await admin
    .from('messages')
    .select('direction, body, sent_at')
    .eq('conversation_id', args.conversationId)
    .order('sent_at', { ascending: false })
    .limit(RECENT_MESSAGE_LIMIT);

  const inbound = (rows ?? []).filter(
    (m): m is { direction: string; body: string; sent_at: string } =>
      m.direction === 'inbound' && Boolean(m.body),
  );
  if (inbound.length === 0) return 0;

  const transcript = inbound
    .reverse()
    .map((m) => `Customer: ${m.body}`)
    .join('\n');

  const { parsed } = await harnessGenerateStructured<ExtractedFact[]>({
    messages: [
      { role: 'system', content: EXTRACTION_PROMPT },
      { role: 'user', content: transcript },
    ],
    temperature: 0.1,
    maxTokens: 600,
    validator: validateFacts,
  });

  const facts = (parsed ?? []).filter((f) => f.confidence >= MIN_CONFIDENCE_TO_STORE);
  if (facts.length === 0) return 0;

  // PDPA gate.
  const pdpa = await getPdpaSettings(args.orgId);
  if (pdpa.memoryMode === 'manual') {
    await recordAction({
      orgId: args.orgId,
      actorType: 'system',
      action: 'memory.skip-manual-mode',
      resourceKind: 'conversation',
      resourceId: args.conversationId,
      metadata: { proposed: facts.length },
    });
    return 0;
  }

  const targetTable = pdpa.memoryMode === 'approval' ? 'pending_facts' : 'customer_memory';

  let inserted = 0;
  let contradictedCount = 0;
  for (const item of facts.slice(0, 5)) {
    let embedding: number[] | null = null;
    try {
      embedding = await embed(item.content);
    } catch {
      // continue without embedding
    }

    // Conflict detection only runs against existing customer_memory in
    // 'auto' mode (approval mode has no committed rows yet).
    if (targetTable === 'customer_memory' && embedding) {
      const similar = await findSimilarMemoriesForCustomer({
        orgId: args.orgId,
        customerId,
        content: item.content,
        limit: 4,
      });

      if (similar.length > 0) {
        const conflict = await detectAndResolveConflict({
          orgId: args.orgId,
          customerId,
          newContent: item.content,
          newConfidence: item.confidence,
          candidatePool: similar,
        });
        if (conflict) contradictedCount += conflict.contradicted.length;
      }
    }

    const insertRow: Record<string, unknown> = {
      org_id: args.orgId,
      customer_id: customerId,
      kind: item.kind,
      content: item.content,
      embedding,
      source_conversation_id: args.conversationId,
    };
    if (targetTable === 'customer_memory') {
      insertRow.confidence = item.confidence;
      insertRow.score = item.confidence;
    }

    const { error } = await admin.from(targetTable).insert(insertRow);
    if (!error) inserted += 1;
  }

  await admin.from('ai_logs').insert({
    org_id: args.orgId,
    conversation_id: args.conversationId,
    kind: 'memory_extract',
    response: {
      count: inserted,
      contradicted: contradictedCount,
      items: facts,
      table: targetTable,
      mode: pdpa.memoryMode,
    },
    accepted: inserted > 0,
  });

  await recordAction({
    orgId: args.orgId,
    actorType: 'ai',
    action: pdpa.memoryMode === 'approval' ? 'memory.queue-pending' : 'memory.write',
    resourceKind: 'conversation',
    resourceId: args.conversationId,
    metadata: {
      inserted,
      contradicted: contradictedCount,
      mode: pdpa.memoryMode,
      target: targetTable,
    },
  });

  return inserted;
}
