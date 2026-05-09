import { notFound } from 'next/navigation';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ChannelKey } from '@/components/ui/channel-icon';
import { InboxShell } from '@/components/inbox/InboxShell';
import { InboxSidebar } from '@/components/inbox/InboxSidebar';
import { InboxList } from '@/components/inbox/InboxList';
import { InboxThreadView } from '@/components/inbox/InboxThreadView';
import { InboxContextPane } from '@/components/inbox/InboxContextPane';
import { loadInboxList } from '../_load';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface MemoryRow {
  id: string;
  kind: string;
  content: string;
  created_at: string;
}

export default async function ConversationPage({ params }: PageProps) {
  const { id } = await params;
  const { orgId } = await requireMembership();
  const admin = createAdminClient();

  // Sidebar + list (shared across routes)
  const list = await loadInboxList(orgId);

  // Active conversation
  const { data: convo } = await admin
    .from('conversations')
    .select(
      `id, status, channel, channel_thread_id, last_message_at, auto_reply_enabled,
       customer_id,
       customers!inner(id, name, avatar_url, channel_ids, tags, created_at)`,
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
    created_at: string;
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

  // Mark thread as read
  await admin
    .from('conversations')
    .update({ unread_count: 0 })
    .eq('id', convo.id)
    .eq('org_id', orgId);

  const messages = (messageRows ?? []).map((m) => ({
    id: m.id,
    direction: m.direction as 'inbound' | 'outbound',
    body: m.body ?? '',
    aiGenerated: m.ai_generated ?? false,
    sentAt: m.sent_at,
  }));

  const memoryRows = (memory ?? []) as MemoryRow[];

  // Format customer "since" date for the context pane.
  const since = customer.created_at
    ? new Date(customer.created_at).toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric',
      })
    : null;

  // Folder derivation from current status — passed to sidebar so the
  // active folder matches what the user is viewing.
  const folder =
    convo.status === 'pending'
      ? 'approval'
      : convo.status === 'human'
        ? 'escalated'
        : 'all';

  return (
    <div className="flex h-[calc(100vh-100px)] min-h-0 flex-col">
      <InboxShell
        sidebar={
          <InboxSidebar
            folder={folder}
            channelCounts={list.channelCounts}
            totalCounts={list.totalCounts}
          />
        }
        list={<InboxList items={list.items} totalCount={list.items.length} />}
        thread={
          <InboxThreadView
            conversationId={convo.id}
            customerName={customer.name}
            channel={(convo.channel as ChannelKey) ?? 'web'}
            status={convo.status}
            autoReplyEnabled={convo.auto_reply_enabled}
            messages={messages}
            customerMeta={{
              tier: customer.tags?.find((t) => /vip|gold|silver|new/i.test(t)) ?? 'Member',
            }}
          />
        }
        context={
          <InboxContextPane
            customerId={customer.id}
            customerName={customer.name ?? 'Unnamed'}
            channel={(convo.channel as ChannelKey) ?? 'web'}
            since={since}
            tags={customer.tags ?? []}
            memory={memoryRows.map((m) => ({
              id: m.id,
              kind: m.kind,
              content: m.content,
            }))}
          />
        }
      />
    </div>
  );
}
