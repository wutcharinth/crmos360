import 'server-only';
import { embed, generate } from '@crmos360/ai';
import { createAdminClient } from '@/lib/supabase/admin';
import { recordAction } from '@/lib/audit';

/**
 * Self-improvement memory engine.
 *
 * Three operations beyond raw write:
 *
 *   1. recallForContext(customerId, query) — vector retrieval scoped to
 *      one customer + active rows + score-weighted ranking. Bumps
 *      use_count + last_used_at on every hit so well-used memories
 *      stay surfaced.
 *
 *   2. detectAndResolveConflict(customerId, newContent) — when a fresh
 *      extraction contradicts a stored fact, marks the loser
 *      'contradicted' with superseded_by pointing at the winner.
 *      Decision is LLM-arbitrated, conservative (only acts on
 *      "directly contradicts", never on "different angle").
 *
 *   3. runDailyLifecycle(orgId) — dedup, recompute scores, decay
 *      low-confidence rows. Designed to be triggered by pg_cron or
 *      a Vercel cron route.
 *
 * Memory promotion (one-customer fact → org lesson) lives in
 * memory-promote.ts so this module stays focused on per-row lifecycle.
 */

export interface RecalledMemory {
  id: string;
  kind: string;
  content: string;
  confidence: number;
  similarity: number;
  score: number;
  use_count: number;
}

export async function recallForContext(args: {
  orgId: string;
  customerId: string;
  query: string;
  limit?: number;
}): Promise<RecalledMemory[]> {
  if (!process.env.GEMINI_API_KEY) return [];
  if (!args.query.trim()) return [];

  let queryVec: number[];
  try {
    queryVec = await embed(args.query);
  } catch {
    return [];
  }

  const admin = createAdminClient();
  const { data, error } = await admin.rpc('customer_memory_match', {
    p_org_id: args.orgId,
    p_customer_id: args.customerId,
    p_query_embedding: queryVec,
    p_match_count: args.limit ?? 8,
    p_match_threshold: 0.55,
  });

  if (error || !Array.isArray(data)) return [];
  const hits = data as RecalledMemory[];

  if (hits.length > 0) {
    const ids = hits.map((h) => h.id);
    await admin.rpc('customer_memory_cite', { p_memory_ids: ids });
  }

  return hits;
}

const CONFLICT_ARBITER = `You are an information consistency checker. Given two facts about the same customer,
decide if NEW directly CONTRADICTS OLD. "Contradicts" means they cannot both be true at
the same time (e.g., "lives in Bangkok" vs "lives in Chiang Mai", "allergic to paraben"
vs "no allergies"). DO NOT flag if they're complementary, overlapping, or differently
phrased versions of the same thing.

Reply strictly as JSON:
  { "contradicts": true|false, "winner": "new"|"old"|"neither", "reason": "<one short sentence>" }

Default to contradicts=false unless clearly contradictory.`;

export async function detectAndResolveConflict(args: {
  orgId: string;
  customerId: string;
  newContent: string;
  newConfidence: number;
  candidatePool: { id: string; content: string; confidence: number }[];
}): Promise<{ contradicted: string[]; reason: string } | null> {
  if (!process.env.GEMINI_API_KEY) return null;
  if (args.candidatePool.length === 0) return null;

  const contradicted: string[] = [];
  const reasons: string[] = [];

  for (const old of args.candidatePool) {
    let parsed: { contradicts?: boolean; winner?: string; reason?: string } | null = null;
    try {
      const res = await generate({
        messages: [
          { role: 'system', content: CONFLICT_ARBITER },
          {
            role: 'user',
            content: `OLD: ${old.content}\nNEW: ${args.newContent}`,
          },
        ],
        temperature: 0,
        maxTokens: 200,
      });
      const text = res.text.trim();
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start >= 0 && end > start) {
        parsed = JSON.parse(text.slice(start, end + 1));
      }
    } catch {
      continue;
    }

    if (!parsed?.contradicts) continue;

    const winner =
      parsed.winner === 'new'
        ? 'new'
        : parsed.winner === 'old'
          ? 'old'
          : args.newConfidence > old.confidence
            ? 'new'
            : 'old';

    if (winner === 'new') {
      contradicted.push(old.id);
      if (parsed.reason) reasons.push(parsed.reason);
    }
    // If old wins, the NEW fact is suppressed by the caller — return early-ish.
  }

  if (contradicted.length === 0) return null;

  const admin = createAdminClient();
  await admin
    .from('customer_memory')
    .update({
      status: 'contradicted',
      updated_at: new Date().toISOString(),
    })
    .in('id', contradicted);

  await recordAction({
    orgId: args.orgId,
    actorType: 'ai',
    action: 'memory.contradict',
    resourceKind: 'customer',
    resourceId: args.customerId,
    metadata: {
      contradicted_ids: contradicted,
      new_content: args.newContent.slice(0, 200),
      reasons: reasons.slice(0, 3),
    },
  });

  return { contradicted, reason: reasons.join('; ').slice(0, 280) };
}

export async function findSimilarMemoriesForCustomer(args: {
  orgId: string;
  customerId: string;
  content: string;
  limit?: number;
}): Promise<{ id: string; content: string; confidence: number }[]> {
  if (!process.env.GEMINI_API_KEY) return [];
  let vec: number[];
  try {
    vec = await embed(args.content);
  } catch {
    return [];
  }

  const admin = createAdminClient();
  const { data } = await admin.rpc('customer_memory_match', {
    p_org_id: args.orgId,
    p_customer_id: args.customerId,
    p_query_embedding: vec,
    p_match_count: args.limit ?? 5,
    p_match_threshold: 0.6,
  });

  return ((data as { id: string; content: string; confidence: number }[] | null) ?? []).map(
    (r) => ({ id: r.id, content: r.content, confidence: r.confidence }),
  );
}

export async function runDailyLifecycle(orgId: string): Promise<{
  merged: number;
  scored: number;
  archived: number;
}> {
  const admin = createAdminClient();

  const { data: dedupRes } = await admin.rpc('customer_memory_dedup', {
    p_org_id: orgId,
    p_threshold: 0.92,
  });
  const merged = typeof dedupRes === 'number' ? dedupRes : 0;

  const { data: scoreRes } = await admin.rpc('customer_memory_recompute_scores', {
    p_org_id: orgId,
  });
  const scored = typeof scoreRes === 'number' ? scoreRes : 0;

  const { data: archivedRes } = await admin
    .from('customer_memory')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('org_id', orgId)
    .eq('status', 'low_confidence')
    .lt(
      'created_at',
      new Date(Date.now() - 60 * 86400_000).toISOString(),
    )
    .select('id');
  const archived = (archivedRes ?? []).length;

  await recordAction({
    orgId,
    actorType: 'system',
    action: 'memory.lifecycle.daily',
    resourceKind: 'org',
    resourceId: orgId,
    metadata: { merged, scored, archived },
  });

  return { merged, scored, archived };
}

export async function manuallySetMemoryStatus(args: {
  orgId: string;
  memoryId: string;
  status: 'active' | 'archived' | 'contradicted';
  actorUserId: string;
}): Promise<void> {
  const admin = createAdminClient();
  await admin
    .from('customer_memory')
    .update({ status: args.status, updated_at: new Date().toISOString() })
    .eq('id', args.memoryId)
    .eq('org_id', args.orgId);

  await recordAction({
    orgId: args.orgId,
    actorType: 'user',
    actorUserId: args.actorUserId,
    action: `memory.${args.status === 'active' ? 'reactivate' : args.status === 'archived' ? 'archive' : 'mark-contradicted'}`,
    resourceKind: 'memory',
    resourceId: args.memoryId,
    metadata: {},
  });
}
