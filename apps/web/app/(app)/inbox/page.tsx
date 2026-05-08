import Link from 'next/link';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { ChannelBadge } from '@/components/app/channel-badge';
import { InboxFilters } from './inbox-filters';

export const dynamic = 'force-dynamic';

interface SearchParams {
  status?: string;
  channel?: string;
}

interface ConversationRow {
  id: string;
  status: string;
  channel: string;
  unread_count: number;
  last_message_at: string;
  auto_reply_enabled: boolean;
  customers: { name: string | null; avatar_url: string | null } | null;
  messages: { body: string | null; direction: string }[];
}

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { orgId } = await requireMembership();
  const params = await searchParams;
  const statusFilter = params.status ?? 'open';
  const channelFilter = params.channel;

  const admin = createAdminClient();

  let query = admin
    .from('conversations')
    .select(
      `id, status, channel, unread_count, last_message_at, auto_reply_enabled,
       customers!inner(name, avatar_url),
       messages(body, direction)`,
    )
    .eq('org_id', orgId)
    .order('last_message_at', { ascending: false })
    .limit(80);

  if (statusFilter !== 'all') query = query.eq('status', statusFilter);
  if (channelFilter) query = query.eq('channel', channelFilter);

  const { data, error } = await query;

  if (error) {
    return (
      <main className="p-8">
        <p className="text-destructive">Failed to load conversations: {error.message}</p>
      </main>
    );
  }

  const rows = (data ?? []) as unknown as ConversationRow[];
  const conversations = rows.map((r) => ({
    ...r,
    lastMessage: r.messages?.[r.messages.length - 1] ?? null,
  }));

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Inbox</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {conversations.length} conversation{conversations.length === 1 ? '' : 's'}
          </p>
        </div>
        <InboxFilters status={statusFilter} channel={channelFilter} />
      </div>

      {conversations.length === 0 ? (
        <EmptyInbox status={statusFilter} />
      ) : (
        <div className="overflow-hidden rounded-lg border bg-background">
          <ul className="divide-y">
            {conversations.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/inbox/${c.id}`}
                  className="block px-4 py-3 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-warm-soft text-sm font-medium text-warm">
                      {(c.customers?.name?.[0] ?? '?').toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium">
                          {c.customers?.name ?? 'Unnamed customer'}
                        </p>
                        <ChannelBadge channel={c.channel} />
                        {c.auto_reply_enabled && (
                          <span className="rounded-full bg-mint-soft px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-mint">
                            auto
                          </span>
                        )}
                        {c.unread_count > 0 && (
                          <span className="rounded-full bg-warm px-1.5 py-0.5 font-mono text-[9px] text-paper">
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {c.lastMessage?.direction === 'outbound' && '→ '}
                        {c.lastMessage?.body ?? '(no messages yet)'}
                      </p>
                    </div>
                    <time className="flex-shrink-0 text-xs text-muted-foreground">
                      {formatRelative(c.last_message_at)}
                    </time>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

function EmptyInbox({ status }: { status: string }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-12 text-center">
      <h3 className="text-base font-medium">No {status} conversations</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Connect a channel in{' '}
        <Link href="/admin/integrations" className="underline hover:text-foreground">
          Integrations
        </Link>{' '}
        to start receiving messages.
      </p>
    </div>
  );
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString();
}
