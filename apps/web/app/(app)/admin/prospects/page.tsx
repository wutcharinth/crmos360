import Link from 'next/link';
import { listMessages, listThreads, type ThreadStatus } from '@/lib/concierge/store';

export const dynamic = 'force-dynamic';

const STATUS_FILTERS: { value: ThreadStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'handed_off', label: 'Handed off' },
  { value: 'closed', label: 'Closed' },
];

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

export default async function ProspectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusParam = (params.status ?? 'all') as ThreadStatus | 'all';
  const threads = statusParam === 'all' ? listThreads() : listThreads({ status: statusParam });

  return (
    <div className="mx-auto max-w-6xl space-y-9 px-8 py-10">
      <header>
        <p className="label-mono">Admin · prospects</p>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,42px)] font-semibold tracking-tight text-ink">
          Concierge threads
        </h1>
        <p className="lead mt-3 max-w-[58ch]">
          Every conversation started from the homepage chatbot. Click a row to see the full
          transcript, AI confidence, and cost.
        </p>
      </header>

      <div className="flex items-center gap-1 border-b border-hairline">
        {STATUS_FILTERS.map((f) => {
          const active = f.value === statusParam;
          return (
            <Link
              key={f.value}
              href={f.value === 'all' ? '/admin/prospects' : `/admin/prospects?status=${f.value}`}
              className={`relative px-3 py-2.5 text-[13px] font-medium transition-colors ${
                active ? 'text-ink' : 'text-mute hover:text-ink'
              }`}
            >
              {f.label}
              {active && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 bg-warm" aria-hidden />
              )}
            </Link>
          );
        })}
      </div>

      {threads.length === 0 ? (
        <div className="rounded-lg border border-dashed border-hairline bg-paper-2/40 px-7 py-14 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            No threads
          </p>
          <p className="mt-2 text-[13.5px] text-ink-2">
            Send a message via the homepage concierge to populate this list.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-md border border-hairline bg-paper px-3.5 py-2 text-[12.5px] font-medium text-ink hover:border-warm/40 hover:text-warm"
          >
            Open homepage →
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-hairline overflow-hidden rounded-lg border border-hairline bg-paper">
          {threads.map((t) => {
            const msgs = listMessages(t.id);
            const last = msgs[msgs.length - 1];
            const inboundCount = msgs.filter((m) => m.direction === 'in').length;
            return (
              <li key={t.id}>
                <Link
                  href={`/admin/prospects/${t.id}`}
                  className="grid gap-3 px-5 py-4 transition-colors hover:bg-paper-2 sm:grid-cols-[100px_1fr_auto] sm:items-center"
                >
                  <span
                    className={`inline-flex h-6 w-fit items-center justify-center rounded-full px-3 font-mono text-[10px] uppercase tracking-[0.14em] ${
                      t.status === 'open'
                        ? 'bg-mint-soft text-mint'
                        : t.status === 'handed_off'
                          ? 'bg-warm-soft text-warm'
                          : 'bg-paper-3 text-mute'
                    }`}
                  >
                    {t.status === 'handed_off' ? 'handoff' : t.status}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
                        {t.email ?? `session ${t.sessionId.slice(0, 10)}`}
                      </p>
                      {t.vertical && (
                        <span className="font-mono text-[10px] uppercase tracking-widest text-warm">
                          {t.vertical}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-snug text-ink-2">
                      {last?.body ?? '(no messages)'}
                    </p>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-mute sm:text-right">
                    {fmtRelative(t.lastMessageAt)} · {inboundCount} in / {msgs.length - inboundCount} out
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
