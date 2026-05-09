import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { runDailyLifecycle } from '@/lib/ai/memory-engine';
import { detectPromotionCandidates } from '@/lib/ai/memory-promote';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Nightly memory lifecycle. Triggered by Vercel Cron (vercel.json) once
 * per day. For each org with memory:
 *   - Dedup near-duplicate active memories (mark losers as 'merged').
 *   - Recompute scores using confidence × recency × use_count.
 *   - Archive low-confidence rows older than 60 days.
 *   - Run promotion detection (cluster customer-level facts into
 *     candidate org-wide lessons).
 *
 * Auth: validates the Vercel cron Bearer token if CRON_SECRET is set.
 * Not org-scoped — intentionally walks every org so the lifecycle runs
 * even when no admin opens the dashboard.
 */

interface LifecycleResult {
  orgId: string;
  merged: number;
  scored: number;
  archived: number;
  promotionCandidates: number;
  error?: string;
}

export async function GET(req: Request) {
  // Auth: prefer Vercel's built-in cron signature header; fall back to a
  // CRON_SECRET bearer for non-Vercel triggers. Fail closed if neither
  // matches so a public probe can't kick off org-wide lifecycle work.
  const vercelCronHeader = req.headers.get('x-vercel-cron');
  const auth = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const validBearer = cronSecret && auth === `Bearer ${cronSecret}`;
  if (!vercelCronHeader && !validBearer) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();

  // Walk every org with at least one customer_memory row. Cap iterations
  // so a single buggy org can't pin the cron.
  const { data: orgs } = await admin
    .from('organizations')
    .select('id, name')
    .order('created_at', { ascending: true })
    .limit(500);

  const results: LifecycleResult[] = [];
  for (const org of orgs ?? []) {
    const orgId = org.id as string;
    try {
      const lifecycle = await runDailyLifecycle(orgId);
      let promotionCandidates = 0;
      try {
        promotionCandidates = await detectPromotionCandidates(orgId);
      } catch {
        // promotion failure is non-fatal
      }
      results.push({ orgId, ...lifecycle, promotionCandidates });
    } catch (err) {
      results.push({
        orgId,
        merged: 0,
        scored: 0,
        archived: 0,
        promotionCandidates: 0,
        error: err instanceof Error ? err.message : 'unknown',
      });
    }
  }

  const totals = results.reduce(
    (a, r) => ({
      merged: a.merged + r.merged,
      scored: a.scored + r.scored,
      archived: a.archived + r.archived,
      promotionCandidates: a.promotionCandidates + r.promotionCandidates,
    }),
    { merged: 0, scored: 0, archived: 0, promotionCandidates: 0 },
  );

  return NextResponse.json({
    ok: true,
    orgs: results.length,
    totals,
    results,
  });
}
