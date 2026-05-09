import { computeOverviewKpis, listUsage } from '@/lib/concierge/store';

export const dynamic = 'force-dynamic';

interface Probe {
  label: string;
  detail: string;
  status: 'ok' | 'warn' | 'down' | 'unknown';
}

async function buildProbes(): Promise<Probe[]> {
  const usage = await listUsage();
  const lastUsage = usage[0];

  return [
    {
      label: 'Concierge · Gemini 2.5 Flash',
      detail:
        lastUsage?.feature === 'concierge'
          ? `Last call ${new Date(lastUsage.createdAt).toLocaleString('en-GB')}, ${
              lastUsage.tokensInput + lastUsage.tokensOutput
            } tokens`
          : 'Not yet exercised in this session.',
      status: lastUsage?.feature === 'concierge' ? 'ok' : 'unknown',
    },
    {
      label: 'API · /api/concierge',
      detail: 'Mounted at apps/web/app/api/concierge/route.ts. POST + GET.',
      status: 'ok',
    },
    {
      label: 'Persistence · prospect store',
      detail: 'In-memory (per-process). Promotion to Supabase tables lands with M1.5 migration.',
      status: 'warn',
    },
    {
      label: 'Auth · Supabase',
      detail: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? 'Configured.'
        : 'Not configured. Dev bypass active for /admin.',
      status: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'ok' : 'warn',
    },
    {
      label: 'AI provider · Anthropic',
      detail: process.env.ANTHROPIC_API_KEY
        ? 'Configured (fallback only, concierge defaults to Gemini).'
        : 'Not configured. Concierge runs on Gemini only.',
      status: 'unknown',
    },
  ];
}

export default async function HealthPage() {
  const [kpis, probes] = await Promise.all([computeOverviewKpis(), buildProbes()]);

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-8 py-10">
      <header>
        <p className="label-mono">Admin · health</p>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,42px)] font-semibold tracking-tight text-ink">
          System status
        </h1>
        <p className="lead mt-3 max-w-[58ch]">
          Probes against each integration the admin dashboard depends on. Production health
          adds latency, error-rate, and uptime panels in M1.5 · Chunk 18.
        </p>
      </header>

      <section>
        <p className="label-mono">Probes</p>
        <ul className="mt-4 divide-y divide-hairline overflow-hidden rounded-lg border border-hairline bg-paper">
          {probes.map((p) => (
            <li key={p.label} className="flex items-start gap-4 px-5 py-4">
              <span
                className={`mt-1 inline-block h-2 w-2 rounded-full ${
                  p.status === 'ok'
                    ? 'bg-mint'
                    : p.status === 'warn'
                      ? 'bg-warm'
                      : p.status === 'down'
                        ? 'bg-rose'
                        : 'bg-mute'
                }`}
                aria-hidden
              />
              <div className="flex-1">
                <p className="text-[14px] font-medium text-ink">{p.label}</p>
                <p className="mt-0.5 text-[12.5px] text-ink-2">{p.detail}</p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                {p.status}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <p className="label-mono">Counters · this session</p>
        <dl className="mt-4 grid gap-x-12 gap-y-4 sm:grid-cols-2">
          <Row label="Threads" value={kpis.totalThreads.toString()} />
          <Row label="Open" value={kpis.openThreads.toString()} />
          <Row label="Handed off" value={kpis.handedOffThreads.toString()} />
          <Row label="Messages" value={kpis.totalMessages.toString()} />
          <Row label="AI replies" value={kpis.aiMessages.toString()} />
          <Row label="Flagged" value={kpis.flaggedJailbreakCount.toString()} />
        </dl>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-hairline pb-2">
      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{label}</dt>
      <dd className="font-mono text-[14px] tabular-nums text-ink">{value}</dd>
    </div>
  );
}
