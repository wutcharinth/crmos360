import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function AiLogsPage() {
  const { orgId, role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') redirect('/dashboard');

  const admin = createAdminClient();

  const { data: rows } = await admin
    .from('ai_logs')
    .select('id, kind, model, response, accepted, latency_ms, created_at, conversation_id')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(150);

  const totalLatency = (rows ?? []).reduce((a, r) => a + (r.latency_ms ?? 0), 0);
  const avgLatency = rows && rows.length > 0 ? Math.round(totalLatency / rows.length) : 0;

  const accepted = (rows ?? []).filter((r) => r.accepted).length;
  const acceptanceRate = rows && rows.length > 0 ? Math.round((accepted / rows.length) * 100) : 0;

  const byKind = new Map<string, number>();
  for (const r of rows ?? []) {
    byKind.set(r.kind, (byKind.get(r.kind) ?? 0) + 1);
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">AI logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Recent AI generations: replies, memory extracts, escalations.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Total events" value={rows?.length ?? 0} />
        <Stat label="Avg latency" value={`${avgLatency}ms`} />
        <Stat label="Acceptance" value={`${acceptanceRate}%`} />
        <Stat label="Models" value={[...new Set((rows ?? []).map((r) => r.model).filter(Boolean))].length} />
      </div>

      {byKind.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">By kind</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[...byKind.entries()].map(([kind, count]) => (
                <li key={kind} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-xs text-muted-foreground">{kind}</span>
                  <span className="font-medium">{count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!rows || rows.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              No AI events yet. Auto-reply runs after the first inbound message
              once GEMINI_API_KEY or ANTHROPIC_API_KEY is set.
            </p>
          ) : (
            <ul className="divide-y">
              {rows.map((r) => {
                const responseText =
                  (r.response as { text?: string } | null)?.text ??
                  JSON.stringify(r.response).slice(0, 80);
                return (
                  <li key={r.id} className="px-4 py-2.5 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider">
                          {r.kind}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {r.model ?? '—'}
                        </span>
                        {r.conversation_id && (
                          <Link
                            href={`/inbox/${r.conversation_id}`}
                            className="font-mono text-xs text-warm hover:underline"
                          >
                            #{r.conversation_id.slice(0, 8)}
                          </Link>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {r.latency_ms != null && <span>{r.latency_ms}ms</span>}
                        <time>{new Date(r.created_at).toLocaleString()}</time>
                      </div>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {responseText}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
