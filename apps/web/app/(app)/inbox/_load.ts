import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ChannelKey } from '@/components/ui/channel-icon';
import type { InboxListItem } from '@/components/inbox/InboxList';

/**
 * Shared loader for the inbox workspace.
 *
 * Both /inbox and /inbox/[id] need the same conversation list + sidebar
 * counts; only the active conversation differs. This helper does the
 * heavy fetch once per render so the routes stay thin.
 */
export interface ChannelCount {
  key: ChannelKey;
  count: number;
}

export interface FolderCounts {
  all: number;
  mine: number;
  unassigned: number;
  approval: number;
  escalated: number;
}

export interface InboxData {
  items: InboxListItem[];
  channelCounts: ChannelCount[];
  totalCounts: FolderCounts;
}

interface ConversationRow {
  id: string;
  status: string;
  channel: string;
  unread_count: number;
  last_message_at: string;
  auto_reply_enabled: boolean;
  customers: { name: string | null; tags: string[] | null } | null;
  messages: { body: string | null; direction: string; sent_at: string }[];
}

const STATUS_TO_TAG: Record<string, InboxListItem['tag']> = {
  open: { label: 'Auto · 94%', cls: 'auto' },
  pending: { label: 'Approval · 78%', cls: 'approve' },
  human: { label: 'Escalate', cls: 'escalate' },
  closed: { label: 'Closed', cls: 'neutral' },
};

export async function loadInboxList(orgId: string): Promise<InboxData> {
  const admin = createAdminClient();

  const { data } = await admin
    .from('conversations')
    .select(
      `id, status, channel, unread_count, last_message_at, auto_reply_enabled,
       customers!inner(name, tags),
       messages(body, direction, sent_at)`,
    )
    .eq('org_id', orgId)
    .order('last_message_at', { ascending: false })
    .limit(80);

  const rows = (data ?? []) as unknown as ConversationRow[];

  const totalCounts: FolderCounts = {
    all: rows.length,
    mine: 0,
    unassigned: rows.filter((r) => r.status === 'open').length,
    approval: rows.filter((r) => r.status === 'pending').length,
    escalated: rows.filter((r) => r.status === 'human').length,
  };

  const channelCountMap = new Map<ChannelKey, number>();
  for (const r of rows) {
    const k = (r.channel as ChannelKey) ?? 'web';
    channelCountMap.set(k, (channelCountMap.get(k) ?? 0) + 1);
  }
  const channelCounts: ChannelCount[] = Array.from(channelCountMap.entries()).map(
    ([key, count]) => ({ key, count }),
  );

  const items: InboxListItem[] = rows.map((r) => {
    const last = r.messages?.[r.messages.length - 1];
    const tag = STATUS_TO_TAG[r.status] ?? { label: r.status, cls: 'neutral' };
    const tags = r.customers?.tags ?? [];
    return {
      id: r.id,
      name: r.customers?.name ?? 'Unnamed customer',
      channel: (r.channel as ChannelKey) ?? 'web',
      unread: (r.unread_count ?? 0) > 0,
      preview: last?.body ?? '(no messages yet)',
      lastAt: r.last_message_at,
      tag,
      vip: tags.some((t) => t.toLowerCase().includes('vip')),
    };
  });

  return { items, channelCounts, totalCounts };
}
