import Link from 'next/link';
import { getDashboardMetrics } from '@/lib/api';
import { ClusterRow } from '@/components/intelligence/ClusterRow';
import { SentimentChart } from '@/components/intelligence/SentimentChart';
import { BottleneckCard } from '@/components/intelligence/BottleneckCard';
import { IntelligenceFilters } from '@/components/intelligence/IntelligenceFilters';

export const dynamic = 'force-dynamic';

export default async function IntelligencePage() {
  const metrics = await getDashboardMetrics();

  const topClusters = metrics.recurringQuestions.slice(0, 6);
  const maxVolume = topClusters.reduce((m, c) => Math.max(m, c.volume), 0) || 1;
  const automate = metrics.automateNext.slice(0, 5);

  // Sentiment fixture seeds a known incident on day 12 (counted from "today").
  // The series is ordered oldest-first → today, length 30, so the incident
  // sits at index (29 - 12) = 17.
  const incidentIndex = Math.max(
    0,
    metrics.sentimentTrend.length - 1 - 12,
  );

  // Find the rule-coverage card so it can be slotted into the wide cell.
  const ruleCoverage = metrics.bottlenecks.find((b) => b.kind === 'rule-coverage');
  const otherBottlenecks = metrics.bottlenecks.filter((b) => b.kind !== 'rule-coverage');

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      {/* Lede */}
      <header>
        <p className="label-mono">Intelligence · last 30 days</p>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.08] tracking-tight text-ink">
          Patterns across your inbox,{' '}
          <em className="not-italic font-semibold text-warm">distilled</em>.
        </h1>
        <p className="lead mt-4 max-w-[62ch]">
          Six recurring-question clusters drive most of last week&rsquo;s volume.
          One known shipping incident shows up in negative sentiment on day 12.
          Five candidate auto-rules would cover ~55% of unhandled cluster volume —
          one click sends them to the Configuration Advisor.
        </p>
      </header>

      {/* Filters + Export */}
      <div className="mt-9">
        <IntelligenceFilters />
      </div>

      {/* TOP — recurring questions, full-width editorial list */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between">
          <p className="label-mono">Recurring questions · top 6</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            volume · week-over-week
          </p>
        </div>
        <div className="mt-5 border-t border-hairline">
          {topClusters.map((c, i) => (
            <ClusterRow
              key={c.id}
              cluster={c}
              rank={i + 1}
              maxVolume={maxVolume}
            />
          ))}
        </div>
      </section>

      {/* MIDDLE — automate-next (left) + sentiment chart (right) */}
      <section className="mt-16 grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_360px]">
        {/* Automate next — list with rule lines, NO card chrome on items */}
        <div>
          <div className="flex items-baseline justify-between">
            <p className="label-mono">Automate next · top 5 candidates</p>
            <Link
              href="/advisor"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute hover:text-warm"
            >
              All candidates →
            </Link>
          </div>
          <ol className="mt-5 border-t border-hairline">
            {automate.map((cand, i) => (
              <li
                key={cand.id}
                className="grid grid-cols-[2.4rem_minmax(0,1fr)_auto] items-baseline gap-x-5 border-b border-hairline py-5 last:border-b-0"
              >
                <span className="font-mono text-[20px] font-light tabular-nums text-ink-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p className="text-[14.5px] leading-snug text-ink">
                    {cand.trigger}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-warm">
                      Proposed
                    </span>{' '}
                    {cand.proposedAction}
                  </p>
                  <p className="mt-2 flex flex-wrap items-baseline gap-x-4 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                    <span>
                      confidence{' '}
                      <span className="tabular-nums text-mint">
                        {Math.round(cand.confidence * 100)}%
                      </span>
                    </span>
                    <span>
                      coverage{' '}
                      <span className="tabular-nums text-ink-2">
                        ~{cand.estimatedCoverage}%
                      </span>
                    </span>
                  </p>
                </div>
                <Link
                  href={`/advisor?source=cluster:${cand.id}`}
                  className="self-start whitespace-nowrap text-[12.5px] text-ink-2 underline-offset-4 hover:text-warm hover:underline"
                >
                  Send to Advisor →
                </Link>
              </li>
            ))}
          </ol>
        </div>

        {/* Sentiment chart — narrow right column */}
        <aside>
          <p className="label-mono">Sentiment · 30 days</p>
          <div className="mt-5 border-t border-hairline pt-6">
            <SentimentChart
              points={metrics.sentimentTrend}
              incidentIndex={incidentIndex}
            />
            <p className="mt-5 text-[13px] leading-relaxed text-ink-2">
              Negative sentiment spiked on day 12 — Kerry shipping window.
              Auto-resolved within 48 hours; trace via{' '}
              <Link
                href="/inbox?status=escalated"
                className="text-warm underline-offset-4 hover:underline"
              >
                escalated conversations
              </Link>
              .
            </p>
          </div>
        </aside>
      </section>

      {/* BOTTOM — bottlenecks, varied shapes; rule-coverage spans 2 cols */}
      <section className="mt-16">
        <p className="label-mono">Bottlenecks · this week</p>
        <div className="mt-5 grid auto-rows-min gap-x-5 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Rule coverage — 2x wide on lg, full-width on md */}
          {ruleCoverage && (
            <div className="md:col-span-2 lg:col-span-2">
              <BottleneckCard card={ruleCoverage} />
            </div>
          )}
          {otherBottlenecks.map((b) => (
            <div key={b.id}>
              <BottleneckCard card={b} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer pointers */}
      <footer className="mt-20 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-hairline pt-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          Nearby
        </p>
        <Link
          href="/inbox"
          className="text-[13px] text-ink-2 underline-offset-4 hover:text-warm hover:underline"
        >
          Inbox →
        </Link>
        <Link
          href="/advisor"
          className="text-[13px] text-ink-2 underline-offset-4 hover:text-warm hover:underline"
        >
          Configuration Advisor →
        </Link>
        <Link
          href="/knowledge"
          className="text-[13px] text-ink-2 underline-offset-4 hover:text-warm hover:underline"
        >
          Knowledge &amp; Lessons →
        </Link>
      </footer>
    </main>
  );
}
