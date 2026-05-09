import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { ChannelBadge } from '@/components/app/channel-badge';
import { HandoffCard } from '@/components/inbox/HandoffCard';
import { ThreadView } from './thread-view';

interface MemoryRow {
  id: string;
  kind: string;
  content: string;
  created_at: string;
}

function buildHandoffPayload(opts: {
  customerName: string | null;
  channel: string;
  recentMessages: { direction: 'inbound' | 'outbound'; body: string }[];
  memory: MemoryRow[];
}): {
  summary: string[];
  reasoning: string;
  suggestedReply?: { body: string; confidence: number };
  relevantMemory: { id: string; kind: 'fact' | 'summary' | 'note'; content: string }[];
} {
  const { customerName, channel, recentMessages, memory } = opts;
  const lastInbound = [...recentMessages].reverse().find((m) => m.direction === 'inbound');
  const lastOutbound = [...recentMessages].reverse().find((m) => m.direction === 'outbound');

  const summary: string[] = [];
  if (customerName) {
    summary.push(`${customerName} writing on ${channel.toUpperCase()}`);
  }
  if (lastInbound) {
    summary.push(`Latest: "${lastInbound.body.slice(0, 140)}${lastInbound.body.length > 140 ? '…' : ''}"`);
  }
  summary.push(
    `${recentMessages.length} message${recentMessages.length === 1 ? '' : 's'} so far · AI confidence dropped below threshold`,
  );

  const relevantMemory = memory.slice(0, 4).map((m) => ({
    id: m.id,
    kind: (m.kind as 'fact' | 'summary' | 'note') ?? 'note',
    content: m.content,
  }));

  return {
    summary,
    reasoning:
      'AI escalated this thread because the most recent reply confidence fell below 0.7 and the conversation contains an unresolved customer ask. Take over or send a tuned reply.',
    suggestedReply: lastOutbound
      ? { body: lastOutbound.body, confidence: 0.66 }
      : undefined,
    relevantMemory,
  };
}

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

  const messages = (messageRows ?? []).map((m) => ({
    id: m.id,
    direction: m.direction as 'inbound' | 'outbound',
    body: m.body ?? '',
    aiGenerated: m.ai_generated ?? false,
    sentAt: m.sent_at,
  }));

  const memoryRows = (memory ?? []) as MemoryRow[];

  const isEscalated = convo.status === 'pending' || convo.status === 'open';
  // Show handoff when AI hasn't been replying recently and there's an unresolved
  // inbound. Heuristic: last message is inbound + at least one AI message earlier.
  const last = messages[messages.length - 1];
  const hasAi = messages.some((m) => m.aiGenerated);
  const showHandoff =
    isEscalated &&
    !!last &&
    last.direction === 'inbound' &&
    hasAi;

  const handoff = showHandoff
    ? buildHandoffPayload({
        customerName: customer.name,
        channel: convo.channel,
        recentMessages: messages.slice(-6),
        memory: memoryRows,
      })
    : null;

  return (
    <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Link
            href="/inbox"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute hover:text-warm"
          >
            ← Back to inbox
          </Link>
        </div>
        <div className="flex items-start justify-between gap-3 rounded-lg border border-hairline bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-soft text-base font-medium text-warm">
              {(customer.name?.[0] ?? '?').toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-ink">{customer.name ?? 'Unnamed customer'}</p>
              <div className="mt-1 flex items-center gap-2">
                <ChannelBadge channel={convo.channel} />
                <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                  status · {convo.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {handoff && (
          <HandoffCard
            summary={handoff.summary}
            reasoning={handoff.reasoning}
            suggestedReply={handoff.suggestedReply}
            relevantMemory={handoff.relevantMemory}
            assigneeName={null}
            composeHref="#compose"
          />
        )}

        <ThreadView
          conversationId={convo.id}
          autoReplyEnabled={convo.auto_reply_enabled}
          status={convo.status}
          messages={messages}
        />
      </div>
      <aside className="space-y-4">
        <div className="rounded-lg border border-hairline bg-card p-4">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Customer
          </h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-xs text-mute">Name</dt>
              <dd className="text-ink">{customer.name ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-mute">LINE ID</dt>
              <dd className="break-all font-mono text-xs text-ink-2">
                {customer.channel_ids?.line ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-mute">Tags</dt>
              <dd className="mt-1 flex flex-wrap gap-1">
                {customer.tags?.length ? (
                  customer.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-paper-2 px-1.5 py-0.5 text-xs text-ink-2"
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-mute">none</span>
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
        <div className="rounded-lg border border-hairline bg-card p-4">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Memory
          </h3>
          {memoryRows.length === 0 ? (
            <p className="mt-3 text-xs text-mute">
              No memory captured yet. AI will extract facts after a few exchanges.
            </p>
          ) : (
            <ul className="mt-3 space-y-2.5 text-sm">
              {memoryRows.map((m) => (
                <li key={m.id} className="rounded-md bg-paper-2 px-3 py-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-warm">
                    {m.kind}
                  </span>
                  <p className="mt-1 text-xs leading-snug text-ink-2">{m.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </main>
  );
}
