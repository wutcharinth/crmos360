import 'server-only';
import { embed, generate } from '@crmos360/ai';
import { createAdminClient } from '@/lib/supabase/admin';
import { recordAction } from '@/lib/audit';

/**
 * Memory promotion — when the same customer-level fact appears across
 * many distinct customers (e.g., "asks about Kerry redelivery" across
 * 30+ buyers), it stops being a customer trait and becomes a brand
 * pattern. Promote it as a candidate lesson and let an admin approve.
 *
 * Detection runs on a schedule (or after each large batch of writes).
 * Picks any active customer_memory cluster where:
 *   - >= MIN_CUSTOMERS distinct customers share a near-duplicate fact,
 *   - average confidence >= 0.7,
 *   - no existing memory_promotion already references the same pattern.
 */

const MIN_CUSTOMERS = 4;
const SIMILARITY_THRESHOLD = 0.85;

const NAME_PROMPT = `Given a list of customer facts that all describe the same brand-level pattern,
write ONE short pattern statement (12 words max, present tense, no customer names) that captures the
shared signal. Example: "Customers expect Kerry redelivery to neighbors." Return only the statement.`;

interface MemoryRow {
  id: string;
  customer_id: string;
  content: string;
  confidence: number;
}

export async function detectPromotionCandidates(orgId: string): Promise<number> {
  if (!process.env.GEMINI_API_KEY) return 0;

  const admin = createAdminClient();

  const { data: pool } = await admin
    .from('customer_memory')
    .select('id, customer_id, content, confidence')
    .eq('org_id', orgId)
    .eq('status', 'active')
    .gte('confidence', 0.6)
    .order('use_count', { ascending: false })
    .limit(500);

  const rows = (pool ?? []) as MemoryRow[];
  if (rows.length < MIN_CUSTOMERS) return 0;

  const vectors = new Map<string, number[]>();
  for (const r of rows) {
    try {
      vectors.set(r.id, await embed(r.content));
    } catch {
      // skip; non-embedded rows can't cluster
    }
  }

  const clusters: { rows: MemoryRow[]; centroidId: string }[] = [];
  const visited = new Set<string>();
  for (const seed of rows) {
    if (visited.has(seed.id)) continue;
    const seedVec = vectors.get(seed.id);
    if (!seedVec) continue;

    const cluster = [seed];
    visited.add(seed.id);

    for (const other of rows) {
      if (visited.has(other.id) || other.customer_id === seed.customer_id) continue;
      const otherVec = vectors.get(other.id);
      if (!otherVec) continue;
      if (cosine(seedVec, otherVec) >= SIMILARITY_THRESHOLD) {
        cluster.push(other);
        visited.add(other.id);
      }
    }

    const distinctCustomers = new Set(cluster.map((c) => c.customer_id));
    if (distinctCustomers.size >= MIN_CUSTOMERS) {
      clusters.push({ rows: cluster, centroidId: seed.id });
    }
  }

  let inserted = 0;
  for (const c of clusters) {
    const distinctCustomers = new Set(c.rows.map((r) => r.customer_id));
    const sample = c.rows.slice(0, 6).map((r) => `- ${r.content}`).join('\n');

    let pattern = c.rows[0]?.content ?? '';
    try {
      const res = await generate({
        messages: [
          { role: 'system', content: NAME_PROMPT },
          { role: 'user', content: sample },
        ],
        temperature: 0.2,
        maxTokens: 80,
      });
      const trimmed = res.text.trim();
      if (trimmed) pattern = trimmed.split('\n')[0]!.slice(0, 200);
    } catch {
      // keep raw seed content as fallback pattern
    }

    // Skip duplicates of an existing promotion candidate.
    const { data: existing } = await admin
      .from('memory_promotions')
      .select('id')
      .eq('org_id', orgId)
      .ilike('pattern', `%${pattern.slice(0, 40)}%`)
      .limit(1);
    if (existing && existing.length > 0) continue;

    const { error } = await admin.from('memory_promotions').insert({
      org_id: orgId,
      pattern,
      example_memory_ids: c.rows.map((r) => r.id),
      customer_count: distinctCustomers.size,
      status: 'pending',
    });
    if (!error) inserted += 1;
  }

  if (inserted > 0) {
    await recordAction({
      orgId,
      actorType: 'system',
      action: 'memory.promotion.detected',
      resourceKind: 'org',
      resourceId: orgId,
      metadata: { candidates: inserted },
    });
  }

  return inserted;
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i]! * b[i]!;
    na += a[i]! * a[i]!;
    nb += b[i]! * b[i]!;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
