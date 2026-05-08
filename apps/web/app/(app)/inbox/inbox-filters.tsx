'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const STATUSES = ['open', 'pending', 'resolved', 'closed', 'all'] as const;
const CHANNELS = ['', 'line', 'messenger', 'instagram'] as const;

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
        className="rounded-md border bg-background px-2 py-1.5 text-sm"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        value={channel ?? ''}
        onChange={(e) => update('channel', e.target.value)}
        className="rounded-md border bg-background px-2 py-1.5 text-sm"
      >
        {CHANNELS.map((c) => (
          <option key={c || 'all'} value={c}>
            {c || 'all channels'}
          </option>
        ))}
      </select>
    </div>
  );
}
