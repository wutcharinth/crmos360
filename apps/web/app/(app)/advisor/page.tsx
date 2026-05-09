import Link from 'next/link';
import { listAdvisorRules } from '@/lib/api';
import { dashboardMetrics } from '@/lib/mocks/fixtures/dashboard';
import { findLesson } from '@/lib/mocks/fixtures/lessons';
import { RuleRow } from '@/components/advisor/RuleRow';
import { RulesTable } from '@/components/advisor/RulesTable';

export const dynamic = 'force-dynamic';

type SourceParam = `cluster:${string}` | `lesson:${string}` | `rule:${string}` | string;

function parsePrefill(source: string | undefined): {
  kind: 'cluster' | 'lesson' | 'rule' | 'unknown';
  id: string;
  representative: string;
} | null {
  if (!source) return null;
  const idx = source.indexOf(':');
  if (idx === -1) return null;
  const kindRaw = source.slice(0, idx);
  const id = source.slice(idx + 1);
  if (!id) return null;
  const kind: 'cluster' | 'lesson' | 'rule' | 'unknown' = ['cluster', 'lesson', 'rule'].includes(
    kindRaw,
  )
    ? (kindRaw as 'cluster' | 'lesson' | 'rule')
    : 'unknown';

  let representative = id;
  if (kind === 'cluster') {
    const c = dashboardMetrics.recurringQuestions.find((q) => q.id === id);
    if (c) representative = c.representativeMessage;
  } else if (kind === 'lesson') {
    const l = findLesson(id);
    if (l) representative = l.statement;
  }
  return { kind, id, representative };
}

export default async function AdvisorPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: SourceParam }>;
}) {
  const params = await searchParams;
  const prefill = parsePrefill(params.source);

  const [pending, active] = await Promise.all([
    listAdvisorRules('pending'),
    listAdvisorRules('active'),
  ]);

  // Pick a rule to highlight when prefilling. Prefer one whose sourceId matches.
  const prefilledRule = prefill
    ? pending.find((r) => r.sourceId === prefill.id) ?? pending[0]
    : null;

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-8 py-10">
      <header>
        <p className="label-mono">Advisor</p>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,42px)] font-semibold tracking-tight text-ink">
          Configuration <em className="font-serif italic text-warm">Advisor</em>
        </h1>
        <p className="lead mt-3 max-w-[58ch]">
          Rule candidates surfaced from clusters and approved lessons. Approve to push them
          into the auto-reply pipeline; reject to drop them; edit to tune the pattern before
          it ships.
        </p>
      </header>

      {prefill && prefilledRule && (
        <PrefillBanner
          kind={prefill.kind}
          id={prefill.id}
          representative={prefill.representative}
          ruleId={prefilledRule.id}
        />
      )}

      {/* Pending candidates */}
      <section className="space-y-5">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <p className="label-mono">Pending candidates</p>
            <h2 className="mt-2 text-[clamp(20px,2vw,26px)] font-semibold tracking-tight text-ink">
              Awaiting your call
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
            {pending.length} candidate{pending.length === 1 ? '' : 's'}
          </span>
        </div>

        {pending.length === 0 ? (
          <div className="rounded-lg border border-dashed border-hairline bg-paper-2/40 px-7 py-12 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              All clear
            </p>
            <p className="mt-2 text-[13.5px] text-ink-2">
              No rule candidates waiting. New ones land here when clusters cross the
              auto-suggest threshold.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-hairline overflow-hidden rounded-lg border border-hairline bg-paper">
            {pending.map((rule) => (
              <RuleRow
                key={rule.id}
                rule={rule}
                variant="pending"
                prefilled={prefilledRule?.id === rule.id}
              />
            ))}
          </ul>
        )}
      </section>

      {/* Active rules library */}
      <section className="space-y-5">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <p className="label-mono">Active rules library</p>
            <h2 className="mt-2 text-[clamp(20px,2vw,26px)] font-semibold tracking-tight text-ink">
              Live in the auto-reply pipeline
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
            {active.length} active
          </span>
        </div>

        <RulesTable rules={active} />
      </section>
    </div>
  );
}

function PrefillBanner({
  kind,
  id,
  representative,
  ruleId,
}: {
  kind: string;
  id: string;
  representative: string;
  ruleId: string;
}) {
  return (
    <div className="rounded-lg border border-warm/30 bg-warm-soft/60 px-5 py-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm">
            Prefilling from {kind} · {id}
          </p>
          <p className="mt-1 line-clamp-1 text-[14px] text-ink" lang="th">
            &ldquo;{representative}&rdquo;
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`#prefill-${ruleId}`}
            className="inline-flex h-8 items-center rounded-md bg-warm px-3 text-[12px] font-medium text-paper hover:opacity-90"
          >
            Open prefilled candidate
          </a>
          <Link
            href="/advisor"
            className="inline-flex h-8 items-center rounded-md border border-hairline bg-paper px-3 text-[12px] font-medium text-ink hover:border-warm/40 hover:text-warm"
          >
            Dismiss
          </Link>
        </div>
      </div>
    </div>
  );
}
