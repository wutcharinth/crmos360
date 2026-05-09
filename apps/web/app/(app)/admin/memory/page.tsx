import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { runLifecycleAction, runPromotionAction } from './actions';

export const dynamic = 'force-dynamic';

interface SummaryRow {
  active_count: number;
  low_confidence_count: number;
  contradicted_count: number;
  merged_count: number;
  archived_count: number;
  avg_confidence: number;
  avg_use_count: number;
  total_customers_with_memory: number;
}

export default async function MemoryGovernancePage() {
  const { orgId, role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') redirect('/dashboard');

  const admin = createAdminClient();

  const [
    { data: summaryArr },
    { data: pendingFacts },
    { data: promotions },
    { data: recentActive },
    { data: contradicted },
  ] = await Promise.all([
    admin.rpc('customer_memory_summary', { p_org_id: orgId }),
    admin
      .from('pending_facts')
      .select('id, kind, content, status, created_at, customer_id')
      .eq('org_id', orgId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(20),
    admin
      .from('memory_promotions')
      .select('id, pattern, customer_count, status, created_at')
      .eq('org_id', orgId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(20),
    admin
      .from('customer_memory')
      .select('id, kind, content, confidence, score, use_count, last_used_at, customer_id')
      .eq('org_id', orgId)
      .eq('status', 'active')
      .order('score', { ascending: false })
      .limit(15),
    admin
      .from('customer_memory')
      .select('id, kind, content, confidence, customer_id, updated_at, superseded_by')
      .eq('org_id', orgId)
      .eq('status', 'contradicted')
      .order('updated_at', { ascending: false })
      .limit(10),
  ]);

  const summary = ((summaryArr ?? []) as SummaryRow[])[0] ?? {
    active_count: 0,
    low_confidence_count: 0,
    contradicted_count: 0,
    merged_count: 0,
    archived_count: 0,
    avg_confidence: 0,
    avg_use_count: 0,
    total_customers_with_memory: 0,
  };

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Memory governance</h1>
          <p className="mt-1 text-sm text-ink-2">
            What FlowAIOS remembers about your customers. Lifecycle is automatic — these
            controls are for review, dedup, and exception handling.
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <form action={runLifecycleAction}>
            <Button type="submit" variant="outline" size="sm">
              Run lifecycle now
            </Button>
          </form>
          <form action={runPromotionAction}>
            <Button type="submit" variant="outline" size="sm">
              Detect promotions
            </Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat
          label="Active"
          value={summary.active_count}
          sub={`${summary.total_customers_with_memory} customers`}
        />
        <Stat
          label="Avg confidence"
          value={`${Math.round(summary.avg_confidence * 100)}%`}
          sub={`avg use ${summary.avg_use_count.toFixed(1)}×`}
        />
        <Stat label="Low confidence" value={summary.low_confidence_count} sub="aging out" />
        <Stat label="Contradicted" value={summary.contradicted_count} sub="superseded" />
        <Stat label="Merged" value={summary.merged_count} sub="dedup hidden" />
      </div>

      {/* Pending PDPA-gated facts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending facts ({pendingFacts?.length ?? 0})</CardTitle>
          <CardDescription>
            PDPA approval mode — review extracted facts before they reach customer memory.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!pendingFacts || pendingFacts.length === 0 ? (
            <p className="p-4 text-sm text-ink-2">No facts waiting for review.</p>
          ) : (
            <ul className="divide-y divide-hairline">
              {pendingFacts.map((p) => (
                <li
                  key={p.id}
                  className="flex items-start justify-between gap-3 px-4 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="mr-2 rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-mute">
                        {p.kind}
                      </span>
                      {p.content}
                    </p>
                    <p className="mt-1 text-xs text-mute">
                      <Link
                        href={`/customers/${p.customer_id}`}
                        className="hover:text-warm hover:underline"
                      >
                        view customer →
                      </Link>
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 gap-1">
                    <form action={`/api/memory/pending/${p.id}/approve`} method="POST">
                      <button className="rounded border border-mint/40 bg-mint-soft px-2 py-1 text-[11px] uppercase tracking-wider text-mint hover:bg-mint/20">
                        approve
                      </button>
                    </form>
                    <form action={`/api/memory/pending/${p.id}/reject`} method="POST">
                      <button className="rounded border border-rose/40 px-2 py-1 text-[11px] uppercase tracking-wider text-rose hover:bg-rose/10">
                        reject
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Promotion candidates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Promotion candidates ({promotions?.length ?? 0})
          </CardTitle>
          <CardDescription>
            Per-customer facts seen across many customers — likely brand-level lessons.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!promotions || promotions.length === 0 ? (
            <p className="p-4 text-sm text-ink-2">
              No promotion candidates yet. Click &quot;Detect promotions&quot; to scan.
            </p>
          ) : (
            <ul className="divide-y divide-hairline">
              {promotions.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p>{p.pattern}</p>
                    <p className="mt-0.5 text-xs text-mute">
                      seen across {p.customer_count} customers · {new Date(
                        p.created_at,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 gap-1">
                    <form action={`/api/memory/promote/${p.id}/accept`} method="POST">
                      <button className="rounded border border-mint/40 bg-mint-soft px-2 py-1 text-[11px] uppercase tracking-wider text-mint hover:bg-mint/20">
                        promote to lesson
                      </button>
                    </form>
                    <form action={`/api/memory/promote/${p.id}/dismiss`} method="POST">
                      <button className="rounded border border-hairline px-2 py-1 text-[11px] uppercase tracking-wider text-mute hover:bg-paper-2">
                        dismiss
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Top scored memories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top-scored active memories</CardTitle>
          <CardDescription>
            The 15 highest-scoring memory rows your AI is currently relying on.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!recentActive || recentActive.length === 0 ? (
            <p className="p-4 text-sm text-ink-2">No active memory yet.</p>
          ) : (
            <ul className="divide-y divide-hairline">
              {recentActive.map((m) => (
                <li
                  key={m.id}
                  className="flex items-start justify-between gap-3 px-4 py-2.5 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p>
                      <span className="mr-2 rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-mute">
                        {m.kind}
                      </span>
                      {m.content}
                    </p>
                    <p className="mt-1 flex items-center gap-3 text-xs text-mute">
                      <span>conf {(m.confidence * 100).toFixed(0)}%</span>
                      <span>used {m.use_count}×</span>
                      <span>score {m.score.toFixed(2)}</span>
                      {m.last_used_at && (
                        <span>last {new Date(m.last_used_at).toLocaleDateString()}</span>
                      )}
                      <Link
                        href={`/customers/${m.customer_id}`}
                        className="hover:text-warm hover:underline"
                      >
                        customer →
                      </Link>
                    </p>
                  </div>
                  <form action={`/api/memory/${m.id}/archive`} method="POST">
                    <button className="rounded border border-hairline px-2 py-1 text-[11px] uppercase tracking-wider text-mute hover:bg-paper-2">
                      archive
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Recent contradictions */}
      {contradicted && contradicted.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recently contradicted</CardTitle>
            <CardDescription>
              These memories were superseded because newer info from the customer overrode them.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-hairline">
              {contradicted.map((m) => (
                <li
                  key={m.id}
                  className="flex items-start justify-between gap-3 px-4 py-2.5 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-mute line-through">
                      <span className="mr-2 rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-mute no-underline">
                        {m.kind}
                      </span>
                      {m.content}
                    </p>
                    <p className="mt-1 text-xs text-mute">
                      conf {(m.confidence * 100).toFixed(0)}% · superseded{' '}
                      {new Date(m.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <form action={`/api/memory/${m.id}/restore`} method="POST">
                    <button className="rounded border border-hairline px-2 py-1 text-[11px] uppercase tracking-wider text-mute hover:bg-paper-2">
                      restore
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-hairline bg-paper p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-mute">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-mute">{sub}</p>}
    </div>
  );
}
