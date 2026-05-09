'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { ChannelIcon, type ChannelKey } from '@/components/ui/channel-icon';

const STATUSES = ['open', 'pending', 'resolved', 'closed', 'all'] as const;
const CHANNELS: ReadonlyArray<ChannelKey | ''> = ['', 'line', 'messenger', 'instagram'];

interface Props {
  status: string;
  channel?: string;
}

export function InboxFilters({ status, channel }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  function update(key: 'status' | 'channel', value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.push(`/inbox?${next.toString()}`));
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <select
        value={status}
        onChange={(e) => update('status', e.target.value)}
        className="rounded-md border border-hairline bg-paper px-2 py-1.5 text-sm text-ink"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <div className="inline-flex items-center gap-1 rounded-md border border-hairline bg-paper-2 p-0.5">
        {CHANNELS.map((c) => {
          const active = (channel ?? '') === c;
          return (
            <button
              key={c || 'all'}
              type="button"
              onClick={() => update('channel', c)}
              aria-pressed={active}
              title={c || 'All channels'}
              className={`inline-flex h-7 w-7 items-center justify-center rounded transition-colors ${
                active ? 'bg-paper text-warm shadow-soft' : 'text-ink-2 hover:text-ink'
              }`}
            >
              {c ? (
                <ChannelIcon channel={c} size={14} />
              ) : (
                <span className="font-mono text-[10px] uppercase">All</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
