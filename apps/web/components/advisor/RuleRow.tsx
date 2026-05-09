import Link from 'next/link';
import type { MockAdvisorRule } from '@/lib/mocks/types';
import { ConfidencePill } from './ConfidencePill';

function fmtRelative(iso: string | null): string {
  if (!iso) return 'never';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const SOURCE_KICKER: Record<MockAdvisorRule['source'], string> = {
  cluster: 'cluster',
  lesson: 'lesson',
  manual: 'manual',
};

/**
 * Asymmetric pending-candidate row.
 * Left: kicker line, rule name, sample-match preview, condition snippet.
 * Right: confidence pill + inline approve / reject / edit actions.
 * Divider lives on the parent <ul>; no border-l-4.
 */
export function RuleRow({
  rule,
  variant,
  prefilled = false,
}: {
  rule: MockAdvisorRule;
  variant: 'pending' | 'active';
  prefilled?: boolean;
}) {
  const sample = rule.sampleMatches[0] ?? '';
  const sourceLabel = rule.sourceId
    ? `${SOURCE_KICKER[rule.source]} · ${rule.sourceId} · ${variant === 'pending' ? 'manual' : 'auto-applied'}`
    : SOURCE_KICKER[rule.source];

  return (
    <li
      id={prefilled ? `prefill-${rule.id}` : undefined}
      className={`px-5 py-5 ${prefilled ? 'bg-warm-soft/40' : ''}`}
    >
      <div className="grid items-start gap-5 lg:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            {sourceLabel}
          </p>
          <Link
            href={`/advisor/${rule.id}`}
            className="mt-1.5 block text-[15px] font-semibold tracking-tight text-ink hover:text-warm"
          >
            {rule.name}
          </Link>
          {sample && (
            <p className="mt-1.5 line-clamp-1 text-[13px] text-ink-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                sample ·
              </span>{' '}
              <span lang="th">&ldquo;{sample}&rdquo;</span>
            </p>
          )}
          <p className="mt-2 line-clamp-1 font-mono text-[11.5px] text-ink-2">
            <span className="text-mute">if</span> {rule.condition}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:justify-end">
          <ConfidencePill score={rule.confidence} />
          {variant === 'pending' ? (
            <>
              <button
                type="button"
                className="inline-flex h-8 items-center rounded-md bg-mint px-3 text-[12px] font-medium text-paper hover:opacity-90"
              >
                Approve
              </button>
              <button
                type="button"
                className="inline-flex h-8 items-center rounded-md border border-hairline bg-paper px-3 text-[12px] font-medium text-ink hover:border-warm/40 hover:text-warm"
              >
                Reject
              </button>
              <Link
                href={`/advisor/${rule.id}`}
                className="inline-flex h-8 items-center rounded-md border border-hairline bg-paper px-3 text-[12px] font-medium text-ink hover:border-warm/40 hover:text-warm"
              >
                Edit
              </Link>
            </>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
              {rule.appliedCount.toLocaleString()} fired · {fmtRelative(rule.lastAppliedAt)}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
