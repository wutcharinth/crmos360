import type { ConfidenceTier } from '@/lib/mocks/types';

export function tierForConfidence(score: number): ConfidenceTier {
  if (score >= 0.9) return 'auto';
  if (score >= 0.75) return 'approval';
  return 'escalate';
}

const TIER_LABEL: Record<ConfidenceTier, string> = {
  auto: 'auto',
  approval: 'approval',
  escalate: 'escalate',
};

const TIER_CLASS: Record<ConfidenceTier, string> = {
  auto: 'bg-mint-soft text-mint',
  approval: 'bg-warm-soft text-warm',
  escalate: 'bg-[hsl(var(--rose)/0.10)] text-rose',
};

export function ConfidencePill({
  score,
  showScore = true,
  className = '',
}: {
  score: number;
  showScore?: boolean;
  className?: string;
}) {
  const tier = tierForConfidence(score);
  const pct = Math.round(score * 100);
  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] ${TIER_CLASS[tier]} ${className}`}
      title={`Confidence ${pct}% — tier: ${tier}`}
    >
      <span>{TIER_LABEL[tier]}</span>
      {showScore && <span className="tabular-nums opacity-80">{pct}%</span>}
    </span>
  );
}
