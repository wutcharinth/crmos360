import Link from 'next/link';
import type { MockDashboardCluster } from '@/lib/mocks/types';
import { ChannelIcon } from '@/components/ui/channel-icon';

interface ClusterRowProps {
  cluster: MockDashboardCluster;
  rank: number;
  /** Largest volume in the displayed set, used to scale the volume bar. */
  maxVolume: number;
}

/**
 * One row in the recurring-questions list. Editorial layout: rank number,
 * representative message, channel chips, inline volume bar, week-over-week
 * delta. Tap target opens the first sample conversation.
 */
export function ClusterRow({ cluster, rank, maxVolume }: ClusterRowProps) {
  const widthPct = Math.max(4, Math.round((cluster.volume / maxVolume) * 100));
  const sampleId = cluster.sampleConversationIds[0];
  const href = sampleId ? `/inbox/${sampleId}` : `/inbox?cluster=${cluster.id}`;
  const deltaPositive = cluster.weekOverWeek > 0;
  const deltaNeutral = cluster.weekOverWeek === 0;

  return (
    <Link
      href={href}
      className="group grid grid-cols-[2.4rem_minmax(0,1fr)_auto] items-baseline gap-x-5 gap-y-2 border-b border-hairline py-4 transition-colors last:border-b-0 hover:bg-paper-2/60 sm:grid-cols-[2.4rem_minmax(0,1.6fr)_minmax(0,1fr)_auto]"
    >
      {/* Rank */}
      <span className="font-mono text-[20px] font-light tabular-nums text-ink-2 group-hover:text-warm">
        {String(rank).padStart(2, '0')}
      </span>

      {/* Representative message + channels */}
      <div className="min-w-0">
        <p
          className="truncate text-[15px] leading-snug text-ink"
          lang="th"
        >
          {cluster.representativeMessage}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
          <span className="inline-flex items-center gap-1.5">
            {cluster.channels.map((c) => (
              <ChannelIcon key={c} channel={c} size={13} />
            ))}
          </span>
          <span className="text-mute/60">/</span>
          <span>
            {cluster.sampleConversationIds.length} sample
            {cluster.sampleConversationIds.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Volume bar — visible from sm up; hidden on mobile to keep the row tight */}
      <div className="hidden min-w-0 sm:block">
        <div className="flex items-center gap-3">
          <div className="h-[3px] flex-1 bg-hairline">
            <div
              className="h-full bg-warm"
              style={{ width: `${widthPct}%` }}
              aria-hidden
            />
          </div>
          <span className="font-mono text-[12px] tabular-nums text-ink-2">
            {cluster.volume.toLocaleString('en-US')}
          </span>
        </div>
      </div>

      {/* Week-over-week */}
      <span
        className={`justify-self-end font-mono text-[12px] tabular-nums ${
          deltaNeutral
            ? 'text-mute'
            : deltaPositive
              ? 'text-warm'
              : 'text-mint'
        }`}
        aria-label={`week over week change ${cluster.weekOverWeek} percent`}
      >
        {deltaPositive ? '+' : ''}
        {cluster.weekOverWeek}
        <span className="ml-0.5 text-mute">%</span>
      </span>
    </Link>
  );
}
