import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { ChannelBadge } from '@/components/app/channel-badge';
import { ThreadView } from './thread-view';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConversationPage({ params }: PageProps) {
  const { id } = await params;
  const { orgId } = await requireMembership();
  const admin = createAdminClient();

  const { data: convo } = await admin
    .from('conversations')
    .select(
      `id, status, channel, channel_thread_id, last_message_at, auto_reply_enabled,
       customer_id,
       customers!inner(id, name, avatar_url, channel_ids, tags)`,
    )
    .eq('id', id)
    .eq('org_id', orgId)
    .maybeSingle();

  if (!convo) notFound();

  const customer = convo.customers as unknown as {
    id: string;
    name: string | null;
    avatar_url: string | null;
    channel_ids: Record<string, string>;
    tags: string[];
  };

  const { data: messageRows } = await admin
    .from('messages')
    .select('id, direction, body, ai_generated, sent_at, sender_user_id')
    .eq('conversation_id', convo.id)
    .order('sent_at', { ascending: true })
    .limit(200);

  const { data: memory } = await admin
    .from('customer_memory')
    .select('id, kind, content, created_at')
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false })
    .limit(20);

  await admin
    .from('conversations')
    .update({ unread_count: 0 })
    .eq('id', convo.id)
    .eq('org_id', orgId);

  return (
    <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Link
            href="/inbox"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to inbox
          </Link>
        </div>
        <div className="flex items-start justify-between gap-3 rounded-lg border bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-soft text-base font-medium text-warm">
              {(customer.name?.[0] ?? '?').toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{customer.name ?? 'Unnamed customer'}</p>
              <div className="mt-1 flex items-center gap-2">
                <ChannelBadge channel={convo.channel} />
                <span className="text-xs text-muted-foreground">
                  status: {convo.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        <ThreadView
          conversationId={convo.id}
          autoReplyEnabled={convo.auto_reply_enabled}
          status={convo.status}
          messages={(messageRows ?? []).map((m) => ({
            id: m.id,
            direction: m.direction as 'inbound' | 'outbound',
            body: m.body ?? '',
            aiGenerated: m.ai_generated ?? false,
            sentAt: m.sent_at,
          }))}
        />
      </div>
      <aside className="space-y-4">
        <div className="rounded-lg border bg-background p-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Customer
          </h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Name</dt>
              <dd>{customer.name ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">LINE ID</dt>
              <dd className="break-all font-mono text-xs">
                {customer.channel_ids?.line ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Tags</dt>
              <dd className="mt-1 flex flex-wrap gap-1">
                {customer.tags?.length ? (
                  customer.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-paper-2 px-1.5 py-0.5 text-xs"
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">none</span>
                )}
              </dd>
            </div>
          </dl>
          <Link
            href={`/customers/${customer.id}`}
            className="mt-3 inline-block text-xs text-warm hover:underline"
          >
            View full profile →
          </Link>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Memory
          </h3>
          {(!memory || memory.length === 0) ? (
            <p className="mt-3 text-xs text-muted-foreground">
              No memory captured yet. AI will extract facts after a few exchanges.
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {memory.map((m) => (
                <li
                  key={m.id}
                  className="rounded border-l-2 border-warm bg-paper-2 px-2.5 py-1.5"
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider text-warm">
                    {m.kind}
                  </span>
                  <p className="mt-0.5 text-xs leading-snug">{m.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </main>
  );
}
