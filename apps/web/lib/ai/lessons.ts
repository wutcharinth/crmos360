import 'server-only';
import { generate, embed } from '@crmos360/ai';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Lesson extraction pipeline.
 *
 * Compares an AI-suggested reply with the message a human actually sent
 * and asks Gemini whether the edit reflects a generalizable rule worth
 * applying to future conversations of the same shape. If yes, persists a
 * candidate lesson with status='pending' for human approval.
 *
 * Modeled on `apps/web/lib/ai/memory.ts`. Same conservative posture: bail
 * silently if no provider key, return 0 on any failure, and keep the
 * extraction schema strict to avoid hallucinated lessons.
 */

const EXTRACTION_PROMPT = `You compare an AI-suggested customer-service reply with the version a human sent instead.

Decide whether this edit reflects a GENERALIZABLE pattern that should apply to future conversations matching the same intent. Most edits are NOT generalizable — they're situation-specific tone or fact corrections. Only emit a lesson when:
  - The same edit would likely apply to other customers asking the same kind of question.
  - The lesson can be stated as "When the customer X, reply with/include Y."
  - The pattern is content-shaped, not style-shaped (style alone rarely generalizes).

Return strictly JSON, no commentary:
  { "generalizable": true, "statement": "<one-sentence rule>", "reasoning": "<why this is generalizable>", "suggestedRule": { "condition": "<plain-language match>", "action": "<plain-language reply behavior>" } }

If NOT generalizable:
  { "generalizable": false, "reasoning": "<why this is one-off>" }

Be strict. Most edits should return generalizable=false.`;

interface ExtractArgs {
  orgId: string;
  conversationId: string;
  /** Body of the AI-suggested reply (saved as a draft / prior message). */
  aiReplyBody: string;
  /** Body of the reply the human actually sent. */
  humanReplyBody: string;
  /** Optional message IDs to backref. */
  aiMessageId?: string;
  humanMessageId?: string;
}

interface ExtractResult {
  generalizable: boolean;
  lessonId: string | null;
  duplicateOf: string | null;
  reasoning: string;
}

const SIMILARITY_DEDUPE_THRESHOLD = 0.92; // cosine similarity above this -> dedupe

export async function extractLessonFromEdit(args: ExtractArgs): Promise<ExtractResult> {
  if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    return { generalizable: false, lessonId: null, duplicateOf: null, reasoning: 'no provider key' };
  }

  const admin = createAdminClient();

  // Trivial-edit short-circuit. If the human reply is character-equal or a tiny
  // whitespace tweak, no extraction needed.
  if (
    args.aiReplyBody.trim() === args.humanReplyBody.trim() ||
    levenshteinSmall(args.aiReplyBody, args.humanReplyBody, 5)
  ) {
    return { generalizable: false, lessonId: null, duplicateOf: null, reasoning: 'trivial edit' };
  }

  // Pull the recent conversation transcript to give the model context.
  const { data: contextRows } = await admin
    .from('messages')
    .select('direction, body, sent_at')
    .eq('conversation_id', args.conversationId)
    .order('sent_at', { ascending: true })
    .limit(20);

  const transcript = (contextRows ?? [])
    .filter((m): m is { direction: string; body: string; sent_at: string } => Boolean(m.body))
    .map((m) => `${m.direction === 'inbound' ? 'Customer' : 'Reply'}: ${m.body}`)
    .join('\n');

  const userPrompt = `# Conversation context\n${transcript}\n\n# AI-suggested reply\n${args.aiReplyBody}\n\n# Human-sent reply\n${args.humanReplyBody}`;

  let parsed: unknown;
  try {
    const res = await generate({
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,
      maxTokens: 500,
    });
    const text = res.text.trim();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) {
      return { generalizable: false, lessonId: null, duplicateOf: null, reasoning: 'no JSON in response' };
    }
    parsed = JSON.parse(text.slice(start, end + 1));
  } catch (err) {
    console.error('lesson extraction LLM failed', err);
    return { generalizable: false, lessonId: null, duplicateOf: null, reasoning: 'LLM error' };
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('generalizable' in parsed)
  ) {
    return { generalizable: false, lessonId: null, duplicateOf: null, reasoning: 'malformed response' };
  }

  const proposal = parsed as {
    generalizable: boolean;
    statement?: string;
    reasoning?: string;
    suggestedRule?: { condition: string; action: string };
  };

  if (!proposal.generalizable) {
    return {
      generalizable: false,
      lessonId: null,
      duplicateOf: null,
      reasoning: proposal.reasoning ?? 'not generalizable',
    };
  }

  if (!proposal.statement || !proposal.reasoning) {
    return { generalizable: false, lessonId: null, duplicateOf: null, reasoning: 'missing statement/reasoning' };
  }

  // Embed the statement for dedupe + future similarity search.
  let embedding: number[] | null = null;
  try {
    embedding = await embed(proposal.statement);
  } catch (err) {
    console.warn('lesson embed failed', err);
  }

  // Dedupe against existing lessons via cosine similarity on the embedding.
  if (embedding) {
    const dup = await findSimilarLesson(args.orgId, embedding);
    if (dup) {
      return {
        generalizable: true,
        lessonId: null,
        duplicateOf: dup.id,
        reasoning: `dedupe: similar to lesson ${dup.id}`,
      };
    }
  }

  const { data: inserted, error } = await admin
    .from('lessons')
    .insert({
      org_id: args.orgId,
      source_conversation_id: args.conversationId,
      source_message_pair_ai_id: args.aiMessageId ?? null,
      source_message_pair_human_id: args.humanMessageId ?? null,
      statement: proposal.statement.slice(0, 1000),
      reasoning: proposal.reasoning.slice(0, 2000),
      embedding,
      suggested_rule_jsonb: proposal.suggestedRule ?? null,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) {
    console.error('failed to insert lesson', error);
    return { generalizable: true, lessonId: null, duplicateOf: null, reasoning: 'insert failed' };
  }

  await admin.from('ai_logs').insert({
    org_id: args.orgId,
    conversation_id: args.conversationId,
    kind: 'lesson_extract',
    response: { statement: proposal.statement, suggestedRule: proposal.suggestedRule },
    accepted: true,
  });

  return {
    generalizable: true,
    lessonId: inserted.id as string,
    duplicateOf: null,
    reasoning: proposal.reasoning,
  };
}

// — Approval / rejection ————————————————————————————————————————————————

export async function approveLesson(lessonId: string, userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { error } = await admin
    .from('lessons')
    .update({
      status: 'approved',
      approved_by_user_id: userId,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', lessonId)
    .eq('status', 'pending'); // idempotent
  return !error;
}

export async function rejectLesson(lessonId: string, userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { error } = await admin
    .from('lessons')
    .update({
      status: 'rejected',
      approved_by_user_id: userId,
      rejected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', lessonId)
    .eq('status', 'pending');
  return !error;
}

// — Lookup helpers ———————————————————————————————————————————————————————

export async function listLessonsForOrg(
  orgId: string,
  status?: 'pending' | 'approved' | 'rejected',
): Promise<{ id: string; statement: string; status: string; createdAt: string }[]> {
  const admin = createAdminClient();
  let q = admin
    .from('lessons')
    .select('id, statement, status, created_at')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });
  if (status) q = q.eq('status', status);
  const { data } = await q.limit(100);
  return (data ?? []).map((r) => ({
    id: r.id as string,
    statement: r.statement as string,
    status: r.status as string,
    createdAt: r.created_at as string,
  }));
}

// — Internal —————————————————————————————————————————————————————————————

async function findSimilarLesson(
  orgId: string,
  embedding: number[],
): Promise<{ id: string; similarity: number } | null> {
  const admin = createAdminClient();
  // Postgres RPC would be cleanest, but for now inline SQL via rpc not available;
  // fall back to a simple match using the order-by-vector-distance pattern.
  // pgvector cosine distance: 1 - cosine_similarity. Threshold for dedupe:
  // similarity >= 0.92  ->  distance <= 0.08.
  const { data } = await admin
    .rpc('match_lesson_embedding', {
      org: orgId,
      query: embedding,
      match_threshold: 1 - SIMILARITY_DEDUPE_THRESHOLD,
    } as never)
    .single();

  if (!data) return null;
  const row = data as { id: string; distance: number };
  return { id: row.id, similarity: 1 - row.distance };
}

/** Approximate Levenshtein-bounded check: returns true if edit distance ≤ threshold. */
function levenshteinSmall(a: string, b: string, threshold: number): boolean {
  const an = a.trim();
  const bn = b.trim();
  if (Math.abs(an.length - bn.length) > threshold) return false;
  // Quick path: count differing characters in aligned windows
  let diff = 0;
  const len = Math.max(an.length, bn.length);
  for (let i = 0; i < len; i++) {
    if (an[i] !== bn[i]) diff += 1;
    if (diff > threshold) return false;
  }
  return true;
}
