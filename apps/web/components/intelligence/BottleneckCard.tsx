import Link from 'next/link';
import type { MockBottleneckCard } from '@/lib/mocks/types';

interface BottleneckCardProps {
  card: MockBottleneckCard;
}

/**
 * Renders a bottleneck card with a kind-specific layout. Each `kind` gets a
 * different visual treatment so the four cards do NOT read as a uniform
 * grid:
 *   - slow-response  → editorial split: title left, big metric right
 *   - after-hours    → wide top row with a 24-hour ASCII-style spark
 *   - agent-workload → numbered roster shape, big percent figure
 *   - rule-coverage  → 2x-wide hero card with CTA into Advisor
 *
 * No card has the same shape as another; that is the point.
 */
export function BottleneckCard({ card }: BottleneckCardProps) {
  switch (card.kind) {
    case 'slow-response':
      return <SlowResponse card={card} />;
    case 'after-hours':
      return <AfterHours card={card} />;
    case 'agent-workload':
      return <AgentWorkload card={card} />;
    case 'rule-coverage':
      return <RuleCoverage card={card} />;
  }
}

// — slow-response ————————————————————————————————————————————————————

function SlowResponse({ card }: { card: MockBottleneckCard }) {
  return (
    <article className="flex h-full flex-col justify-between border-t-2 border-rose/70 bg-paper-2 p-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-rose">
          Bottleneck · slow response
        </p>
        <h3 className="mt-3 text-[18px] font-semibold leading-snug text-ink">
          {card.title}
        </h3>
      </div>
      <div className="mt-6 flex items-baseline gap-3">
        <span className="text-[clamp(28px,3.2vw,40px)] font-semibold tracking-tight text-ink tabular-nums">
          {card.metric}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-rose">
          {card.delta}
        </span>
      </div>
      <p className="mt-4 text-[13.5px] leading-relaxed text-ink-2">
        {card.description}
      </p>
    </article>
  );
}

// — after-hours ————————————————————————————————————————————————————

function AfterHours({ card }: { card: MockBottleneckCard }) {
  // 24-segment day visualisation; flag 22:00–06:00 as "after-hours".
  const segments = Array.from({ length: 24 }, (_, h) => h);
  return (
    <article className="flex h-full flex-col bg-paper p-6 shadow-soft">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm">
          Bottleneck · after-hours
        </p>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
          22:00 — 06:00
        </span>
      </div>
      <h3 className="mt-3 text-[18px] font-semibold leading-snug text-ink">
        {card.title}
      </h3>

      {/* 24-bar day spark */}
      <div className="mt-5 flex h-9 items-end gap-[2px]">
        {segments.map((h) => {
          const afterHours = h >= 22 || h < 6;
          // Gentle wave so it looks like data, not a static bar.
          const heightPct = afterHours
            ? 80 - Math.abs(h === 23 ? 0 : h - 23) * 6
            : 30 + Math.sin((h - 6) / 4) * 20;
          return (
            <span
              key={h}
              className={`flex-1 ${afterHours ? 'bg-rose' : 'bg-hairline-2'}`}
              style={{ height: `${Math.max(8, heightPct)}%` }}
              aria-hidden
            />
          );
        })}
      </div>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="text-[clamp(28px,3.2vw,40px)] font-semibold tracking-tight text-ink tabular-nums">
          {card.metric}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-rose">
          {card.delta}
        </span>
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">
        {card.description}
      </p>
    </article>
  );
}

// — agent-workload ————————————————————————————————————————————————————

function AgentWorkload({ card }: { card: MockBottleneckCard }) {
  // Static roster shape for the prototype — 5 silhouettes, 1 highlighted.
  const roster = [
    { name: 'Pim', value: 38, highlight: true },
    { name: 'Aor', value: 16 },
    { name: 'Toon', value: 14 },
    { name: 'Boon', value: 12 },
    { name: 'Other', value: 20 },
  ];
  const total = roster.reduce((s, r) => s + r.value, 0);

  return (
    <article className="flex h-full flex-col bg-paper p-6 shadow-soft">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm">
        Bottleneck · agent workload
      </p>
      <h3 className="mt-3 text-[18px] font-semibold leading-snug text-ink">
        {card.title}
      </h3>

      <ul className="mt-5 space-y-2">
        {roster.map((r) => {
          const widthPct = (r.value / total) * 100;
          return (
            <li key={r.name} className="flex items-center gap-3">
              <span
                className={`w-12 font-mono text-[11px] uppercase tracking-[0.14em] ${
                  r.highlight ? 'text-warm' : 'text-mute'
                }`}
              >
                {r.name}
              </span>
              <div className="h-[2px] flex-1 bg-hairline">
                <div
                  className={`h-full ${r.highlight ? 'bg-warm' : 'bg-hairline-2'}`}
                  style={{ width: `${widthPct}%` }}
                  aria-hidden
                />
              </div>
              <span className="w-8 text-right font-mono text-[11px] tabular-nums text-ink-2">
                {r.value}%
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 text-[13.5px] leading-relaxed text-ink-2">
        {card.description}
      </p>
    </article>
  );
}

// — rule-coverage (2x wider hero) ————————————————————————————————————

function RuleCoverage({ card }: { card: MockBottleneckCard }) {
  return (
    <article className="flex h-full flex-col justify-between bg-warm-soft/55 p-7">
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm">
            Bottleneck · rule coverage · highest signal
          </p>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-warm">
            {card.delta}
          </span>
        </div>
        <h3 className="mt-3 text-[clamp(20px,2.2vw,26px)] font-semibold leading-tight tracking-tight text-ink">
          {card.title}
        </h3>
        <p className="mt-4 max-w-[58ch] text-[14.5px] leading-relaxed text-ink-2">
          {card.description}
        </p>
      </div>

      <div className="mt-7 flex flex-wrap items-baseline gap-x-9 gap-y-4 border-t border-hairline pt-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Volume at stake
          </p>
          <p className="mt-1 text-[clamp(26px,3vw,36px)] font-semibold tracking-tight tabular-nums text-ink">
            {card.metric}
          </p>
        </div>
        <span className="hidden font-mono text-mute sm:block" aria-hidden>
          |
        </span>
        <div className="flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Next move
          </p>
          <p className="mt-1 text-[14px] text-ink-2">
            Approve the 5 candidates in <em className="not-italic font-medium text-ink">Automate next</em> to cover ~55%.
          </p>
        </div>
        <Link
          href="/advisor?source=cluster:auto_001"
          className="rounded-lg bg-warm px-4 py-2.5 text-[13px] font-medium text-paper transition-all hover:-translate-y-px hover:bg-warm-2 hover:shadow-cta"
        >
          Open Advisor →
        </Link>
      </div>
    </article>
  );
}
