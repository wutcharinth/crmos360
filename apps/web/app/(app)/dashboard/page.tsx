import Link from 'next/link';
import { requireMembership } from '@/lib/auth/current-user';
import { getDashboardStats } from '@/lib/dashboard/queries';
import { ChannelBadge } from '@/components/app/channel-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HourlyChart } from './hourly-chart';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { orgId, orgName, user } = await requireMembership();
  const stats = await getDashboardStats(orgId);

  const greeting = greetingForHour(new Date().getHours());

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">
          {greeting}, {firstName(user.email ?? '')}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening at {orgName} today.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Conversations (24h)" value={stats.conversations24h} />
        <Kpi label="Inbound messages" value={stats.inboundMessages24h} />
        <Kpi
          label="AI auto-replies"
          value={stats.aiReplies24h}
          sub={
            stats.autoReplyRate > 0
              ? `${Math.round(stats.autoReplyRate * 100)}% of outbound`
              : undefined
          }
        />
        <Kpi label="Open conversations" value={stats.openConversations} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity (last 24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <HourlyChart data={stats.hourlyVolume} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Channels (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.channelBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No channel activity yet. Connect one in{' '}
                <Link href="/admin/integrations" className="underline">
                  Integrations
                </Link>
                .
              </p>
            ) : (
              <ul className="space-y-3">
                {stats.channelBreakdown.map(({ channel, count }) => {
                  const total = stats.channelBreakdown.reduce((a, b) => a + b.count, 0);
                  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
                  return (
                    <li key={channel}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <ChannelBadge channel={channel} />
                        <span className="font-mono text-xs">
                          {count} · {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-paper-2">
                        <div
                          className="h-full bg-warm"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No messages yet.
            </p>
          ) : (
            <ul className="divide-y">
              {stats.recentActivity.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/inbox/${m.conversationId}`}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm transition-colors hover:bg-accent/50"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span
                        className={`inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                          m.direction === 'inbound' ? 'bg-mint' : 'bg-warm'
                        }`}
                      />
                      <span className="flex-shrink-0 font-medium">
                        {m.customerName ?? '—'}
                      </span>
                      {m.aiGenerated && (
                        <span className="rounded bg-mint-soft px-1.5 py-0.5 font-mono text-[10px] uppercase text-mint">
                          AI
                        </span>
                      )}
                      <span className="truncate text-muted-foreground">{m.body ?? '(empty)'}</span>
                    </div>
                    <time className="flex-shrink-0 text-xs text-muted-foreground">
                      {new Date(m.sentAt).toLocaleString()}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function Kpi({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function greetingForHour(h: number): string {
  if (h < 5) return 'Working late';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Working late';
}

function firstName(email: string): string {
  return email.split('@')[0]?.split('.')[0] ?? 'there';
}
