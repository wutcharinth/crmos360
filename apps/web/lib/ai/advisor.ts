import 'server-only';
import { embed } from '@crmos360/ai';
import { createAdminClient } from '@/lib/supabase/admin';
import { recordAction } from '@/lib/audit';

/**
 * Configuration Advisor — proposes + applies auto-reply rules.
 *
 * Two proposal sources:
 *   - proposeRulesFromCluster(): given a recurring-question cluster from
 *     the Intelligence Dashboard, draft a rule that would handle it.
 *   - proposeRulesFromLesson(): given an approved lesson, lock the
 *     pattern in as a rule.
 *
 * Approved rules are loaded by applyRules() at the top of the auto-reply
 * pipeline. A matching rule short-circuits the model call.
 */

interface ClusterInput {
  id: string;
  representativeMessage: string;
  channels: string[];
  volume: number;
}

interface LessonInput {
  id: string;
  statement: string;
  suggestedRule: { condition: string; action: string } | null;
}

interface RuleProposal {
  id: string;
  name: string;
  conditionText: string;
  actionText: string;
  source: 'cluster' | 'lesson' | 'manual';
  sourceId: string | null;
  confidence: number;
}

export async function proposeRulesFromCluster(
  orgId: string,
  cluster: ClusterInput,
): Promise<RuleProposal | null> {
  if (cluster.volume < 5) return null;

  const admin = createAdminClient();

  // Skip if a rule from this cluster already exists.
  const { data: existing } = await admin
    .from('advisor_rules')
    .select('id')
    .eq('org_id', orgId)
    .eq('source', 'cluster')
    .eq('source_id', cluster.id)
    .limit(1);

  if (existing && existing.length > 0) return null;

  const embedding = await embed(cluster.representativeMessage).catch(() => null);

  const { data: inserted, error } = await admin
    .from('advisor_rules')
    .insert({
      org_id: orgId,
      name: deriveName(cluster.representativeMessage),
      condition_text: `Customer asks "${truncate(cluster.representativeMessage, 80)}" or similar`,
      action_text: 'Auto-reply with the templated response (edit before approving).',
      match_jsonb: embedding
        ? { kind: 'embedding', centroid: embedding, threshold: 0.78 }
        : { kind: 'intent_cluster', cluster_id: cluster.id },
      action_jsonb: {
        kind: 'auto_reply',
        template: '[Edit me before approving — this rule was proposed from a cluster.]',
      },
      source: 'cluster',
      source_id: cluster.id,
      status: 'pending',
      confidence: Math.min(85, 50 + cluster.volume / 10),
    })
    .select('id, name, condition_text, action_text, source, source_id, confidence')
    .single();

  if (error || !inserted) return null;

  await recordAction({
    orgId,
    actorType: 'ai',
    action: 'advisor.propose-from-cluster',
    resourceKind: 'advisor_rule',
    resourceId: inserted.id as string,
    metadata: { clusterId: cluster.id, volume: cluster.volume },
  });

  return {
    id: inserted.id as string,
    name: inserted.name as string,
    conditionText: inserted.condition_text as string,
    actionText: inserted.action_text as string,
    source: inserted.source as RuleProposal['source'],
    sourceId: (inserted.source_id as string | null) ?? null,
    confidence: inserted.confidence as number,
  };
}

export async function proposeRulesFromLesson(
  orgId: string,
  lesson: LessonInput,
): Promise<RuleProposal | null> {
  if (!lesson.suggestedRule) return null;
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from('advisor_rules')
    .select('id')
    .eq('org_id', orgId)
    .eq('source', 'lesson')
    .eq('source_id', lesson.id)
    .limit(1);

  if (existing && existing.length > 0) return null;

  const embedding = await embed(lesson.statement).catch(() => null);

  const { data: inserted, error } = await admin
    .from('advisor_rules')
    .insert({
      org_id: orgId,
      name: deriveName(lesson.statement),
      condition_text: lesson.suggestedRule.condition,
      action_text: lesson.suggestedRule.action,
      match_jsonb: embedding
        ? { kind: 'embedding', centroid: embedding, threshold: 0.78 }
        : { kind: 'lesson', lesson_id: lesson.id },
      action_jsonb: { kind: 'auto_reply', template: lesson.suggestedRule.action },
      source: 'lesson',
      source_id: lesson.id,
      status: 'pending',
      confidence: 70, // lessons have human-validated reasoning, ship slightly higher
    })
    .select('id, name, condition_text, action_text, source, source_id, confidence')
    .single();

  if (error || !inserted) return null;

  await recordAction({
    orgId,
    actorType: 'ai',
    action: 'advisor.propose-from-lesson',
    resourceKind: 'advisor_rule',
    resourceId: inserted.id as string,
    metadata: { lessonId: lesson.id },
  });

  return {
    id: inserted.id as string,
    name: inserted.name as string,
    conditionText: inserted.condition_text as string,
    actionText: inserted.action_text as string,
    source: inserted.source as RuleProposal['source'],
    sourceId: (inserted.source_id as string | null) ?? null,
    confidence: inserted.confidence as number,
  };
}

// — Approve / reject / disable —————————————————————————————————————————————

export async function approveRule(ruleId: string, userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { error } = await admin
    .from('advisor_rules')
    .update({
      status: 'active',
      approved_by_user_id: userId,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', ruleId)
    .eq('status', 'pending');
  return !error;
}

export async function rejectRule(ruleId: string, userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { error } = await admin
    .from('advisor_rules')
    .update({
      status: 'disabled',
      approved_by_user_id: userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', ruleId);
  return !error;
}

// — applyRules: called at top of auto-reply pipeline ——————————————————————

export interface MatchedRule {
  ruleId: string;
  ruleName: string;
  actionKind: string;
  actionPayload: Record<string, unknown>;
  similarity: number;
}

interface MatchInput {
  orgId: string;
  body: string;
}

/**
 * Find the highest-confidence active rule that matches `body`. Returns
 * null when no rule matches above the threshold.
 *
 * Strategy:
 *   1. Pull all active rules for the org (cap 200).
 *   2. For each `embedding` rule: cosine-similarity against the input
 *      embedding; threshold from the rule itself.
 *   3. For each `keyword` rule: simple any-of match.
 *   4. Return the top match, increment applied_count, write audit.
 */
export async function applyRules(input: MatchInput): Promise<MatchedRule | null> {
  const admin = createAdminClient();
  const { data: rules } = await admin
    .from('advisor_rules')
    .select('id, name, match_jsonb, action_jsonb, applied_count')
    .eq('org_id', input.orgId)
    .eq('status', 'active')
    .limit(200);

  if (!rules || rules.length === 0) return null;

  let inputEmbedding: number[] | null = null;
  const needsEmbedding = (rules as { match_jsonb: { kind?: string } }[]).some(
    (r) => r.match_jsonb?.kind === 'embedding',
  );
  if (needsEmbedding) {
    inputEmbedding = await embed(input.body).catch(() => null);
  }

  let best: MatchedRule | null = null;

  for (const r of rules as Array<{
    id: string;
    name: string;
    match_jsonb: Record<string, unknown>;
    action_jsonb: Record<string, unknown>;
  }>) {
    const match = r.match_jsonb;
    if (match.kind === 'embedding' && inputEmbedding) {
      const centroid = match.centroid as number[];
      const threshold = (match.threshold as number) ?? 0.78;
      const sim = cosine(inputEmbedding, centroid);
      if (sim >= threshold && (!best || sim > best.similarity)) {
        best = {
          ruleId: r.id,
          ruleName: r.name,
          actionKind: (r.action_jsonb.kind as string) ?? 'auto_reply',
          actionPayload: r.action_jsonb,
          similarity: sim,
        };
      }
    } else if (match.kind === 'keyword') {
      const anyOf = (match.any_of as string[]) ?? [];
      const lower = input.body.toLowerCase();
      const hit = anyOf.find((kw) => lower.includes(kw.toLowerCase()));
      if (hit && !best) {
        best = {
          ruleId: r.id,
          ruleName: r.name,
          actionKind: (r.action_jsonb.kind as string) ?? 'auto_reply',
          actionPayload: r.action_jsonb,
          similarity: 1.0,
        };
      }
    }
  }

  if (best) {
    // Bump telemetry. Fire-and-forget; don't block the reply.
    void admin
      .from('advisor_rules')
      .update({
        applied_count: ((rules as { id: string; applied_count: number }[]).find(
          (r) => r.id === best!.ruleId,
        )?.applied_count ?? 0) + 1,
        last_applied_at: new Date().toISOString(),
      })
      .eq('id', best.ruleId);

    void recordAction({
      orgId: input.orgId,
      actorType: 'ai',
      action: 'advisor.apply',
      resourceKind: 'advisor_rule',
      resourceId: best.ruleId,
      metadata: { similarity: best.similarity, ruleName: best.ruleName },
    });
  }

  return best;
}

// — Helpers —————————————————————————————————————————————————————————————

function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    na += a[i]! * a[i]!;
    nb += b[i]! * b[i]!;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function deriveName(s: string): string {
  return truncate(s.replace(/\s+/g, ' ').trim(), 60);
}
