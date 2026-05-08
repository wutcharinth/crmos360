import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

export interface DashboardStats {
  conversations24h: number;
  inboundMessages24h: number;
  aiReplies24h: number;
  autoReplyRate: number;
  customers: number;
  openConversations: number;
  channelBreakdown: { channel: string; count: number }[];
  recentActivity: {
    id: string;
    direction: 'inbound' | 'outbound';
    body: string | null;
    aiGenerated: boolean;
    sentAt: string;
    customerName: string | null;
    conversationId: string;
  }[];
  hourlyVolume: { hour: string; inbound: number; outbound: number }[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

export async function getDashboardStats(orgId: string): Promise<DashboardStats> {
  const admin = createAdminClient();
  const since = new Date(Date.now() - DAY_MS).toISOString();
  const since7d = new Date(Date.now() - 7 * DAY_MS).toISOString();

  const [
    { count: conversations24h },
    { data: messages24h },
    { count: customers },
    { count: openConversations },
    { data: channelRows },
    { data: recentMessages },
  ] = await Promise.all([
    admin
      .from('conversations')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .gte('created_at', since),
    admin
      .from('messages')
      .select('id, direction, ai_generated, sent_at, body, conversation_id')
      .eq('org_id', orgId)
      .gte('sent_at', since)
      .order('sent_at', { ascending: false }),
    admin
      .from('customers')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', orgId),
    admin
      .from('conversations')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .eq('status', 'open'),
    admin
      .from('conversations')
      .select('channel')
      .eq('org_id', orgId)
      .gte('created_at', since7d),
    admin
      .from('messages')
      .select('id, direction, body, ai_generated, sent_at, conversation_id, conversations!inner(customers!inner(name))')
      .eq('org_id', orgId)
      .order('sent_at', { ascending: false })
      .limit(15),
  ]);

  const inbound = (messages24h ?? []).filter((m) => m.direction === 'inbound');
  const outbound = (messages24h ?? []).filter((m) => m.direction === 'outbound');
  const aiReplies = outbound.filter((m) => m.ai_generated);

  const channelMap = new Map<string, number>();
  for (const r of channelRows ?? []) {
    const ch = (r as { channel: string }).channel;
    channelMap.set(ch, (channelMap.get(ch) ?? 0) + 1);
  }

  const hours = new Map<string, { inbound: number; outbound: number }>();
  for (let i = 23; i >= 0; i--) {
    const d = new Date(Date.now() - i * 60 * 60 * 1000);
    const key = `${d.getHours().toString().padStart(2, '0')}h`;
    hours.set(key, { inbound: 0, outbound: 0 });
  }
  for (const m of messages24h ?? []) {
    const d = new Date(m.sent_at);
    const key = `${d.getHours().toString().padStart(2, '0')}h`;
    const slot = hours.get(key);
    if (slot) {
      if (m.direction === 'inbound') slot.inbound += 1;
      else slot.outbound += 1;
    }
  }

  const recentActivity = (recentMessages ?? []).map((m) => {
    const conv = m.conversations as unknown as { customers: { name: string | null } | null };
    return {
      id: m.id as string,
      direction: m.direction as 'inbound' | 'outbound',
      body: (m.body as string | null) ?? null,
      aiGenerated: Boolean(m.ai_generated),
      sentAt: m.sent_at as string,
      customerName: conv?.customers?.name ?? null,
      conversationId: m.conversation_id as string,
    };
  });

  return {
    conversations24h: conversations24h ?? 0,
    inboundMessages24h: inbound.length,
    aiReplies24h: aiReplies.length,
    autoReplyRate: outbound.length === 0 ? 0 : aiReplies.length / outbound.length,
    customers: customers ?? 0,
    openConversations: openConversations ?? 0,
    channelBreakdown: [...channelMap.entries()].map(([channel, count]) => ({ channel, count })),
    recentActivity,
    hourlyVolume: [...hours.entries()].map(([hour, v]) => ({ hour, ...v })),
  };
}
