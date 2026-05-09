import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdvisorRule } from '@/lib/api';
import { dashboardMetrics } from '@/lib/mocks/fixtures/dashboard';
import { findLesson } from '@/lib/mocks/fixtures/lessons';
import { ConfidencePill } from '@/components/advisor/ConfidencePill';

export const dynamic = 'force-dynamic';

const STATUS_CLASS: Record<string, string> = {
  active: 'bg-mint-soft text-mint',
  pending: 'bg-warm-soft text-warm',
  disabled: 'bg-paper-3 text-mute',
};

export default async function AdvisorRuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rule = await getAdvisorRule(id);
  if (!rule) notFound();

  // Source cross-link payload.
  const cluster =
    rule.source === 'cluster' && rule.sourceId
      ? dashboardMetrics.recurringQuestions.find((c) => c.id === rule.sourceId)
      : null;
  const lesson = rule.source === 'lesson' && rule.sourceId ? findLesson(rule.sourceId) : null;

  return (
    <div className="mx-auto grid max-w-6xl gap-9 px-8 py-10 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0">
        <Link
          href="/advisor"
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute hover:text-warm"
        >
          ← All rule candidates
        </Link>

        <header className="mt-5">
          <p className="label-mono">
            Rule · {rule.id} · <span className="text-warm">{rule.source}</span>
            {rule.sourceId && <span className="text-mute"> · {rule.sourceId}</span>}
          </p>
          <h1 className="mt-3 text-[clamp(24px,2.8vw,34px)] font-semibold tracking-tight text-ink">
            {rule.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ConfidencePill score={rule.confidence} />
            <span
              className={`inline-flex h-6 items-center rounded-full px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                STATUS_CLASS[rule.status] ?? STATUS_CLASS.pending
              }`}
            >
              {rule.status}
            </span>
            {rule.status === 'active' && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                {rule.appliedCount.toLocaleString()} applications
              </span>
            )}
          </div>
        </header>

        {/* Source pattern + cross-link */}
        {(cluster || lesson) && (
          <section className="mt-9">
            <p className="label-mono">Source pattern</p>
            <div className="mt-3 rounded-lg border border-hairline bg-paper p-5">
              {cluster && (
                <>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
                    cluster · {cluster.volume.toLocaleString()} matches · WoW{' '}
                    <span className={cluster.weekOverWeek >= 0 ? 'text-mint' : 'text-rose'}>
                      {cluster.weekOverWeek >= 0 ? '+' : ''}
                      {cluster.weekOverWeek}%
                    </span>
                  </p>
                  <p className="mt-2 text-[15px] text-ink" lang="th">
                    &ldquo;{cluster.representativeMessage}&rdquo;
                  </p>
                  <Link
                    href={`/intelligence?cluster=${cluster.id}`}
                    className="mt-3 inline-flex h-8 items-center rounded-md border border-hairline bg-paper-2 px-3 text-[12px] font-medium text-ink hover:border-warm/40 hover:text-warm"
                  >
                    Open in Intelligence →
                  </Link>
                </>
              )}
              {lesson && (
                <>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
                    lesson · {lesson.status}
                  </p>
                  <p className="mt-2 text-[15px] text-ink">{lesson.statement}</p>
                  <p className="mt-2 text-[13px] text-ink-2">{lesson.reasoning}</p>
                  <Link
                    href={`/knowledge/lessons/${lesson.id}`}
                    className="mt-3 inline-flex h-8 items-center rounded-md border border-hairline bg-paper-2 px-3 text-[12px] font-medium text-ink hover:border-warm/40 hover:text-warm"
                  >
                    Open in Knowledge →
                  </Link>
                </>
              )}
            </div>
          </section>
        )}

        {/* Sample matches */}
        <section className="mt-9">
          <p className="label-mono">Sample matches · {rule.sampleMatches.length}</p>
          <ul className="mt-3 divide-y divide-hairline overflow-hidden rounded-lg border border-hairline bg-paper">
            {rule.sampleMatches.map((sample, i) => (
              <li key={i} className="px-5 py-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                    #{String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="flex-1 text-[14px] text-ink" lang="th">
                    {sample}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Proposed condition */}
        <section className="mt-9">
          <p className="label-mono">Proposed condition</p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-hairline bg-paper-2/60 p-5 font-mono text-[12.5px] leading-relaxed text-ink">
            <code>WHEN {rule.condition}</code>
          </pre>
        </section>

        {/* Proposed action */}
        <section className="mt-9">
          <p className="label-mono">Proposed action</p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-hairline bg-paper-2/60 p-5 font-mono text-[12.5px] leading-relaxed text-ink">
            <code>THEN {rule.action}</code>
          </pre>
        </section>
      </div>

      {/* Right rail · approval workflow */}
      <aside className="space-y-6 lg:sticky lg:top-[88px] lg:self-start">
        <section className="rounded-xl border border-hairline bg-paper-2/60 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Approval workflow
          </p>
          <p className="mt-2 text-[12.5px] text-ink-2">
            Choose how this rule lands. You can change auto-apply later from the active rules
            library.
          </p>
          <div className="mt-4 space-y-2">
            <button
              type="button"
              className="flex w-full flex-col items-start gap-0.5 rounded-md bg-mint px-3.5 py-2.5 text-left text-paper hover:opacity-90"
            >
              <span className="text-[13px] font-semibold">Approve and apply</span>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-90">
                live in pipeline now
              </span>
            </button>
            <button
              type="button"
              className="flex w-full flex-col items-start gap-0.5 rounded-md border border-hairline bg-paper px-3.5 py-2.5 text-left text-ink hover:border-warm/40 hover:text-warm"
            >
              <span className="text-[13px] font-semibold">Approve, don&rsquo;t auto-apply</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                save as draft, suggest only
              </span>
            </button>
            <button
              type="button"
              className="flex w-full flex-col items-start gap-0.5 rounded-md border border-hairline bg-paper px-3.5 py-2.5 text-left text-ink hover:border-warm/40 hover:text-warm"
            >
              <span className="text-[13px] font-semibold">Edit before approving</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                tune condition / action
              </span>
            </button>
            <button
              type="button"
              className="flex w-full flex-col items-start gap-0.5 rounded-md border border-hairline bg-paper px-3.5 py-2.5 text-left text-rose hover:border-[hsl(var(--rose)/0.4)]"
            >
              <span className="text-[13px] font-semibold">Reject</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                drop the candidate
              </span>
            </button>
          </div>
        </section>

        <section>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Telemetry
          </p>
          <dl className="mt-3 space-y-1.5 text-[13px]">
            <Row label="Confidence" value={`${Math.round(rule.confidence * 100)}%`} mono />
            <Row label="Source" value={rule.source} mono />
            <Row label="Source ID" value={rule.sourceId ?? '—'} mono />
            <Row
              label="Applied"
              value={rule.appliedCount.toLocaleString()}
              mono
            />
            <Row
              label="Last fired"
              value={rule.lastAppliedAt ? new Date(rule.lastAppliedAt).toLocaleString() : '—'}
              mono
            />
          </dl>
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
        className={`max-w-[170px] truncate text-right text-ink-2 ${
          mono ? 'font-mono text-[11px]' : ''
        }`}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}
