import Link from 'next/link';
import {
  computeOverviewKpis,
  listThreads,
  listUsage,
  microsToTHB,
  microsToUSD,
  listMessages,
} from '@/lib/concierge/store';

export const dynamic = 'force-dynamic';

function fmt(n: number): string {
  return n.toLocaleString('en-US');
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

export default function AdminOverviewPage() {
  const kpis = computeOverviewKpis();
  const recentThreads = listThreads({ limit: 6 });
  const recentUsage = listUsage(5);

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-8 py-10">
      <header>
        <p className="label-mono">Admin · overview</p>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,42px)] font-semibold leading-tight tracking-tight text-ink">
          What happened today
        </h1>
        <p className="lead mt-3 max-w-[58ch]">
          Live KPIs from the concierge chatbot, AI usage ledger, and prospect inbox. The
          counters reset on dev-server restart while persistence is in-memory; persistence
          to Supabase lands with the prospect-thread migration.
        </p>
      </header>

      {/* Activity — editorial layout: two oversized stats inline, two
          secondary stats below as dl rows. Not a 4-card grid. */}
      <section>
        <p className="label-mono">Activity · live</p>
        <div className="mt-5 flex flex-col flex-wrap gap-y-7 sm:flex-row sm:items-baseline sm:gap-x-14">
          <div>
            <p className="text-[clamp(38px,4vw,52px)] font-semibold leading-none tracking-tight tabular-nums text-ink">
              {fmt(kpis.totalThreads)}
            </p>
            <p className="mt-2 text-[12.5px] text-ink-2">
              prospect threads · {kpis.openThreads} open · {kpis.handedOffThreads} handed off
            </p>
          </div>
          <span className="hidden font-mono text-mute sm:block">|</span>
          <div>
            <p className="text-[clamp(38px,4vw,52px)] font-semibold leading-none tracking-tight tabular-nums text-ink">
              {fmt(kpis.totalMessages)}
            </p>
            <p className="mt-2 text-[12.5px] text-ink-2">
              conversations · {kpis.aiMessages} AI replies
            </p>
          </div>
        </div>
        <dl className="mt-7 grid grid-cols-2 gap-x-9 gap-y-2 border-t border-hairline pt-5 sm:grid-cols-4">
          <SubStat label="Last 24h" value={fmt(kpis.threadsLast24h)} sub="new threads" />
          <SubStat label="Last 7d" value={fmt(kpis.threadsLast7d)} sub="new threads" />
          <SubStat
            label="AI replies"
            value={`${kpis.totalMessages > 0 ? Math.round((kpis.aiMessages / kpis.totalMessages) * 100) : 0}%`}
            sub="of total volume"
          />
          <SubStat
            label="Flagged"
            value={fmt(kpis.flaggedJailbreakCount)}
            sub="prompt-injection attempts"
          />
        </dl>
      </section>

      <section>
        <p className="label-mono">AI cost · this dev session</p>
        <div className="mt-4 flex flex-col flex-wrap gap-y-7 sm:flex-row sm:items-baseline sm:gap-x-12">
          <div>
            <span className="text-[clamp(28px,3vw,38px)] font-semibold tracking-tight tabular-nums text-ink">
              {fmt(kpis.totalTokensInput + kpis.totalTokensOutput)}
            </span>
            <span className="ml-2 font-mono text-[11px] uppercase tracking-widest text-mute">
              tokens
            </span>
            <p className="mt-1 text-[12px] text-mute">
              {fmt(kpis.totalTokensInput)} in / {fmt(kpis.totalTokensOutput)} out
            </p>
          </div>
          <span className="hidden font-mono text-mute sm:block">|</span>
          <div>
            <span className="text-[clamp(28px,3vw,38px)] font-semibold tracking-tight tabular-nums text-warm">
              {microsToUSD(kpis.totalCostMicros)}
            </span>
            <span className="ml-2 font-mono text-[11px] uppercase tracking-widest text-mute">
              {microsToTHB(kpis.totalCostMicros)}
            </span>
            <p className="mt-1 text-[12px] text-mute">Gemini 2.5 Flash, est.</p>
          </div>
          <span className="hidden font-mono text-mute sm:block">|</span>
          <div>
            <span className="text-[clamp(28px,3vw,38px)] font-semibold tracking-tight tabular-nums text-rose">
              {fmt(kpis.flaggedJailbreakCount)}
            </span>
            <span className="ml-2 font-mono text-[11px] uppercase tracking-widest text-mute">
              flagged
            </span>
            <p className="mt-1 text-[12px] text-mute">
              <Link href="/admin/jailbreak" className="hover:text-warm">
                jailbreak attempts →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Recent threads — list, not card grid */}
      <section>
        <div className="flex items-baseline justify-between">
          <p className="label-mono">Recent prospects</p>
          <Link href="/admin/prospects" className="text-[12.5px] text-mute hover:text-warm">
            All threads →
          </Link>
        </div>
        <div className="mt-4 divide-y divide-hairline overflow-hidden rounded-lg border border-hairline bg-paper">
          {recentThreads.length === 0 ? (
            <EmptyState
              kicker="No threads yet"
              detail="Send a message via the concierge widget on the homepage to populate this list."
            />
          ) : (
            recentThreads.map((t) => {
              const msgs = listMessages(t.id);
              const last = msgs[msgs.length - 1];
              return (
                <Link
                  key={t.id}
                  href={`/admin/prospects/${t.id}`}
                  className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-paper-2"
                >
                  <span
                    className={`mt-0.5 inline-flex h-6 w-[78px] flex-shrink-0 items-center justify-center rounded-full font-mono text-[10px] uppercase tracking-[0.14em] ${
                      t.status === 'open'
                        ? 'bg-mint-soft text-mint'
                        : t.status === 'handed_off'
                          ? 'bg-warm-soft text-warm'
                          : 'bg-paper-3 text-mute'
                    }`}
                  >
                    {t.status === 'handed_off' ? 'handoff' : t.status}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
                        {t.email ?? `session ${t.sessionId.slice(0, 8)}`}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
                        {fmtRelative(t.lastMessageAt)} · {msgs.length} msg
                      </p>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-snug text-ink-2">
                      {last?.body ?? '(no messages)'}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <p className="label-mono">Recent AI usage</p>
          <Link href="/admin/cost" className="text-[12.5px] text-mute hover:text-warm">
            Full ledger →
          </Link>
        </div>
        <table className="mt-4 w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-hairline">
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                When
              </th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                Feature
              </th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                Model
              </th>
              <th className="py-2 pr-4 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                Tokens
              </th>
              <th className="py-2 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {recentUsage.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-7 text-center text-[12px] text-mute">
                  Nothing yet. Send a concierge message to start the ledger.
                </td>
              </tr>
            ) : (
              recentUsage.map((u) => (
                <tr key={u.id} className="border-b border-hairline last:border-b-0">
                  <td className="py-2.5 pr-4 text-mute">{fmtRelative(u.createdAt)}</td>
                  <td className="py-2.5 pr-4 font-mono text-[12px] text-ink">{u.feature}</td>
                  <td className="py-2.5 pr-4 font-mono text-[12px] text-mute">{u.model}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums text-ink-2">
                    {fmt(u.tokensInput + u.tokensOutput)}
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-warm">
                    {microsToUSD(u.costMicros)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function SubStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{label}</p>
      <p className="mt-1 text-[18px] font-semibold tabular-nums text-ink">{value}</p>
      <p className="mt-0.5 text-[11px] text-mute">{sub}</p>
    </div>
  );
}

function Kpi({ big, label, value, sub }: { big?: boolean; label: string; value: string; sub: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{label}</p>
      <p
        className={`mt-2 font-semibold tracking-tight tabular-nums text-ink ${
          big ? 'text-[clamp(34px,3.4vw,46px)]' : 'text-[clamp(24px,2.4vw,30px)]'
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-[12px] text-mute">{sub}</p>
    </div>
  );
}

function EmptyState({ kicker, detail }: { kicker: string; detail: string }) {
  return (
    <div className="px-5 py-9 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{kicker}</p>
      <p className="mt-2 text-[13px] text-ink-2">{detail}</p>
    </div>
  );
}
