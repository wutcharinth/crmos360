import {
  computeOverviewKpis,
  listUsage,
  microsToTHB,
  microsToUSD,
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

export default async function CostPage() {
  const [kpis, ledger] = await Promise.all([computeOverviewKpis(), listUsage()]);
  const byFeature = ledger.reduce<
    Record<string, { tokens: number; micros: number; calls: number }>
  >((acc, e) => {
    const cur = acc[e.feature] ?? { tokens: 0, micros: 0, calls: 0 };
    cur.tokens += e.tokensInput + e.tokensOutput;
    cur.micros += e.costMicros;
    cur.calls += 1;
    acc[e.feature] = cur;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-8 py-10">
      <header>
        <p className="label-mono">Admin · cost</p>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,42px)] font-semibold tracking-tight text-ink">
          AI usage ledger
        </h1>
        <p className="lead mt-3 max-w-[58ch]">
          Every Gemini and Claude call recorded with tokens and estimated cost. THB
          conversion at 36/USD; verify against Google&rsquo;s current pricing for billing.
        </p>
      </header>

      <section>
        <p className="label-mono">Total · this dev session</p>
        <div className="mt-4 flex flex-col flex-wrap gap-y-7 sm:flex-row sm:items-baseline sm:gap-x-12">
          <Stat
            big
            label="USD"
            value={microsToUSD(kpis.totalCostMicros)}
            sub="estimated"
            tone="warm"
          />
          <span className="hidden font-mono text-mute sm:block">|</span>
          <Stat
            label="THB"
            value={microsToTHB(kpis.totalCostMicros)}
            sub="@ 36/USD"
          />
          <span className="hidden font-mono text-mute sm:block">|</span>
          <Stat
            label="Tokens in"
            value={fmt(kpis.totalTokensInput)}
          />
          <Stat
            label="Tokens out"
            value={fmt(kpis.totalTokensOutput)}
          />
          <Stat
            label="LLM calls"
            value={fmt(ledger.length)}
          />
        </div>
      </section>

      {Object.keys(byFeature).length > 0 && (
        <section>
          <p className="label-mono">By feature</p>
          <div className="mt-4 overflow-hidden rounded-lg border border-hairline">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-paper-2">
                <tr>
                  <Th>Feature</Th>
                  <Th align="right">Calls</Th>
                  <Th align="right">Tokens</Th>
                  <Th align="right">USD</Th>
                  <Th align="right">THB</Th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(byFeature)
                  .sort((a, b) => b[1].micros - a[1].micros)
                  .map(([feature, agg]) => (
                    <tr key={feature} className="border-t border-hairline">
                      <td className="px-4 py-3 font-mono text-[12.5px] text-ink">{feature}</td>
                      <Td align="right" mono>{fmt(agg.calls)}</Td>
                      <Td align="right" mono>{fmt(agg.tokens)}</Td>
                      <Td align="right" mono className="text-warm">
                        {microsToUSD(agg.micros)}
                      </Td>
                      <Td align="right" mono className="text-mute">
                        {microsToTHB(agg.micros)}
                      </Td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section>
        <p className="label-mono">Ledger</p>
        {ledger.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-hairline bg-paper-2/40 px-5 py-9 text-center text-[13px] text-mute">
            No AI calls in this session yet.
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-lg border border-hairline">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-paper-2">
                <tr>
                  <Th>When</Th>
                  <Th>Feature</Th>
                  <Th>Model</Th>
                  <Th align="right">In</Th>
                  <Th align="right">Out</Th>
                  <Th align="right">USD</Th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((e) => (
                  <tr key={e.id} className="border-t border-hairline">
                    <td className="px-4 py-2.5 text-mute">{fmtRelative(e.createdAt)}</td>
                    <td className="px-4 py-2.5 font-mono text-[12px] text-ink">{e.feature}</td>
                    <td className="px-4 py-2.5 font-mono text-[12px] text-mute">{e.model}</td>
                    <Td align="right" mono>{fmt(e.tokensInput)}</Td>
                    <Td align="right" mono>{fmt(e.tokensOutput)}</Td>
                    <Td align="right" mono className="text-warm">
                      {microsToUSD(e.costMicros)}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  big,
  label,
  value,
  sub,
  tone,
}: {
  big?: boolean;
  label: string;
  value: string;
  sub?: string;
  tone?: 'warm' | 'mint';
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{label}</p>
      <p
        className={`mt-2 font-semibold tracking-tight tabular-nums ${
          big ? 'text-[clamp(28px,3vw,38px)]' : 'text-[clamp(20px,2vw,26px)]'
        } ${tone === 'warm' ? 'text-warm' : 'text-ink'}`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-[12px] text-mute">{sub}</p>}
    </div>
  );
}

function Th({ children, align }: { children: React.ReactNode; align?: 'right' }) {
  return (
    <th
      className={`px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-mute ${
        align === 'right' ? 'text-right' : ''
      }`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align,
  mono,
  className,
}: {
  children: React.ReactNode;
  align?: 'right';
  mono?: boolean;
  className?: string;
}) {
  return (
    <td
      className={`px-4 py-2.5 ${align === 'right' ? 'text-right' : ''} ${
        mono ? 'font-mono text-[12px] tabular-nums text-ink-2' : 'text-ink-2'
      } ${className ?? ''}`}
    >
      {children}
    </td>
  );
}
