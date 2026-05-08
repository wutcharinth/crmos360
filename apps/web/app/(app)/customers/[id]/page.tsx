import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { ChannelBadge } from '@/components/app/channel-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { orgId } = await requireMembership();
  const admin = createAdminClient();

  const { data: customer } = await admin
    .from('customers')
    .select('id, name, avatar_url, channel_ids, tags, custom, created_at')
    .eq('id', id)
    .eq('org_id', orgId)
    .maybeSingle();

  if (!customer) notFound();

  const [{ data: conversations }, { data: memory }, { data: messageStats }] = await Promise.all([
    admin
      .from('conversations')
      .select('id, channel, status, last_message_at')
      .eq('customer_id', customer.id)
      .order('last_message_at', { ascending: false })
      .limit(20),
    admin
      .from('customer_memory')
      .select('id, kind, content, created_at')
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false })
      .limit(50),
    admin
      .from('messages')
      .select('id, direction', { count: 'exact' })
      .in(
        'conversation_id',
        (
          await admin
            .from('conversations')
            .select('id')
            .eq('customer_id', customer.id)
        ).data?.map((c) => c.id) ?? [],
      ),
  ]);

  const inboundCount = (messageStats ?? []).filter((m) => m.direction === 'inbound').length;
  const outboundCount = (messageStats ?? []).filter((m) => m.direction === 'outbound').length;

  const channelIds = (customer.channel_ids ?? {}) as Record<string, string>;

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-8">
      <Link href="/customers" className="text-sm text-muted-foreground hover:text-foreground">
        ← All customers
      </Link>

      <div className="flex items-start gap-4 rounded-lg border bg-background p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warm-soft text-2xl font-medium text-warm">
          {(customer.name?.[0] ?? '?').toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{customer.name ?? 'Unnamed'}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Added {new Date(customer.created_at as string).toLocaleDateString()}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(channelIds).map(([ch, val]) => (
              <span key={ch} className="flex items-center gap-1.5 text-xs">
                <ChannelBadge channel={ch} />
                <code className="font-mono text-muted-foreground">{val}</code>
              </span>
            ))}
            {customer.tags?.map((t: string) => (
              <span key={t} className="rounded bg-paper-2 px-2 py-0.5 text-xs">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right text-sm">
          <p className="font-mono text-2xl tabular-nums">
            {inboundCount}
            <span className="text-muted-foreground">/</span>
            {outboundCount}
          </p>
          <p className="text-xs text-muted-foreground">in / out msgs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!conversations || conversations.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No conversations yet.</p>
            ) : (
              <ul className="divide-y">
                {conversations.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/inbox/${c.id}`}
                      className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <ChannelBadge channel={c.channel} />
                        <span className="capitalize text-muted-foreground">{c.status}</span>
                      </div>
                      <time className="text-xs text-muted-foreground">
                        {new Date(c.last_message_at).toLocaleString()}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Memory</CardTitle>
          </CardHeader>
          <CardContent>
            {!memory || memory.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No memory captured yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {memory.map((m) => (
                  <li
                    key={m.id}
                    className="rounded border-l-2 border-warm bg-paper-2 px-3 py-2"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider text-warm">
                      {m.kind}
                    </span>
                    <p className="mt-0.5 text-sm">{m.content}</p>
                    <time className="mt-1 block text-[10px] text-muted-foreground">
                      {new Date(m.created_at).toLocaleString()}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
