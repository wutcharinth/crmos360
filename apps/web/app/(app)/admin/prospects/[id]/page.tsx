import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getThread,
  listMessages,
  microsToTHB,
  microsToUSD,
} from '@/lib/concierge/store';

export const dynamic = 'force-dynamic';

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  });
}

function fmtRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default async function ProspectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thread = getThread(id);
  if (!thread) notFound();

  const messages = listMessages(thread.id);
  const aiMessages = messages.filter((m) => m.aiGenerated);
  const totalTokens = aiMessages.reduce(
    (sum, m) => sum + (m.tokensInput ?? 0) + (m.tokensOutput ?? 0),
    0,
  );
  const totalCost = aiMessages.reduce((sum, m) => sum + (m.costMicros ?? 0), 0);

  return (
    <div className="mx-auto grid max-w-6xl gap-9 px-8 py-10 lg:grid-cols-[1fr_300px]">
      <div className="min-w-0">
        <Link
          href="/admin/prospects"
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute hover:text-warm"
        >
          ← All prospects
        </Link>

        <header className="mt-5">
          <p className="label-mono">Thread · {thread.id.slice(0, 8)}</p>
          <h1 className="mt-3 text-[clamp(24px,2.6vw,32px)] font-semibold tracking-tight text-ink">
            {thread.email ?? `Anonymous · session ${thread.sessionId.slice(0, 10)}`}
          </h1>
          <p className="mt-2 text-[13px] text-ink-2">
            Started {fmtRelative(thread.createdAt)} · {messages.length} messages ·{' '}
            <span
              className={`font-mono text-[11px] uppercase tracking-widest ${
                thread.status === 'open'
                  ? 'text-mint'
                  : thread.status === 'handed_off'
                    ? 'text-warm'
                    : 'text-mute'
              }`}
            >
              {thread.status === 'handed_off' ? 'handoff' : thread.status}
            </span>
          </p>
        </header>

        <div className="mt-9 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.direction === 'in' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${m.direction === 'in' ? 'text-right' : ''}`}>
                <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-mute">
                  {m.direction === 'in' ? 'visitor' : 'concierge'} · {fmtTime(m.createdAt)}
                  {m.flagged && (
                    <span className="ml-2 rounded-full bg-[hsl(var(--rose)/0.10)] px-2 py-0.5 text-rose">
                      flagged: {m.flagged}
                    </span>
                  )}
                </p>
                <div
                  className={`whitespace-pre-wrap rounded-xl px-4 py-3 text-[14px] leading-relaxed ${
                    m.direction === 'in'
                      ? 'bg-warm text-paper'
                      : 'bg-paper-2 text-ink'
                  }`}
                >
                  {m.body}
                </div>
                {m.aiGenerated && m.tokensInput !== null && (
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-mute">
                    {m.tokensInput}↓ {m.tokensOutput}↑ ·{' '}
                    {microsToUSD(m.costMicros ?? 0)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-7 lg:sticky lg:top-[88px] lg:self-start">
        <section>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Cost
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[28px] font-semibold tabular-nums text-warm">
              {microsToUSD(totalCost)}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-mute">
              {microsToTHB(totalCost)}
            </span>
          </div>
          <p className="mt-1 text-[12px] text-mute">{totalTokens.toLocaleString()} tokens total</p>
        </section>

        <section>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Visitor
          </p>
          <dl className="mt-3 space-y-1.5 text-[13px]">
            <Row label="Session" value={thread.sessionId.slice(0, 12) + '…'} mono />
            <Row label="Email" value={thread.email ?? '—'} />
            <Row label="Name" value={thread.name ?? '—'} />
            <Row label="Vertical" value={thread.vertical ?? 'unset'} mono />
            <Row label="UTM" value={thread.utmSource ?? '—'} mono />
            <Row label="UA" value={thread.userAgent?.slice(0, 30) ?? '—'} mono />
          </dl>
        </section>

        <section className="rounded-xl border border-hairline bg-paper-2/60 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Actions
          </p>
          <p className="mt-2 text-[12.5px] text-ink-2">
            Status flips and follow-up email composer ship in the next admin pass. For now,
            handoff happens via concierge prompt logic.
          </p>
        </section>
      </aside>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-mute">{label}</dt>
      <dd
        className={`max-w-[160px] truncate text-right text-ink-2 ${
          mono ? 'font-mono text-[11px]' : ''
        }`}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}
