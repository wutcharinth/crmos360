'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ChannelIcon, type ChannelKey } from '@/components/ui/channel-icon';
import { formatRelative } from '@/lib/util/format-time';

/**
 * Middle column — conversation list.
 *
 * Header: Inbox title + live count badge, search input with ⌘K hint,
 * filter chip row (All / Auto / Approval / Escalate / Growth / VIP).
 *
 * Body: virtualized-style list (no actual virtualization yet, but the
 * markup matches). Each row: avatar with channel sub-badge, name +
 * preview, right-side stamp + status pill. Active row gets a 3px warm
 * left rail and warm-soft background.
 *
 * Filter is local UI state — narrows the visible set without re-fetching.
 * The route's underlying data still contains the unfiltered list so the
 * count stays accurate.
 */
export interface InboxListItem {
  id: string;
  name: string;
  channel: ChannelKey;
  unread: boolean;
  preview: string;
  lastAt: string;
  tag: { label: string; cls: 'auto' | 'approve' | 'escalate' | 'growth' | 'neutral' };
  vip: boolean;
}

const FILTERS = ['All', 'Auto', 'Approval', 'Escalate', 'Growth', 'VIP'] as const;
type Filter = (typeof FILTERS)[number];

export function InboxList({
  items,
  totalCount,
}: {
  items: InboxListItem[];
  totalCount: number;
}) {
  const pathname = usePathname();
  const [filter, setFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return items.filter((c) => {
      if (filter === 'VIP' && !c.vip) return false;
      if (filter !== 'All' && filter !== 'VIP' && c.tag.cls !== filter.toLowerCase()) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.preview.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [items, filter, query]);

  return (
    <>
      <div className="flex shrink-0 flex-col gap-2.5 border-b border-hairline px-4 py-3.5">
        <h2 className="flex items-center gap-2 text-[15.5px] font-semibold tracking-[-0.012em]">
          <span>Inbox</span>
          <span className="rounded-full bg-mint-soft px-1.5 py-0.5 font-mono text-[10px] text-mint">
            live · {totalCount}
          </span>
        </h2>
        <div className="flex items-center gap-2 rounded-md border border-hairline bg-paper-2 px-2.5 py-1.5">
          <SearchIcon />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาแชท · ลูกค้า · ออเดอร์"
            className="flex-1 bg-transparent text-[13px] text-ink placeholder:text-mute focus:outline-none"
          />
          <span className="rounded border border-hairline bg-paper px-1 font-mono text-[10px] text-mute">
            ⌘K
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full border px-2.5 py-1 font-mono text-[10.5px] tracking-wide transition-colors ${
                filter === f
                  ? 'border-ink bg-ink text-paper'
                  : 'border-hairline bg-paper-2 text-ink-2 hover:bg-paper-3'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-mute">No conversations match this filter.</p>
          </div>
        ) : (
          <ul>
            {filtered.map((c) => {
              const active = pathname === `/inbox/${c.id}`;
              return (
                <li key={c.id}>
                  <Link
                    href={`/inbox/${c.id}`}
                    className={`relative grid grid-cols-[36px_1fr_auto] gap-2.5 border-b border-hairline px-3.5 py-3 transition-colors ${
                      active ? 'bg-warm-soft' : 'hover:bg-paper-2'
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-warm"
                      />
                    )}
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-paper-2 text-[13px] font-semibold text-ink-2">
                      {initials(c.name)}
                      <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 overflow-hidden rounded-[5px] ring-2 ring-paper">
                        <ChannelIcon channel={c.channel} size={16} />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <p className="flex items-center gap-1.5 truncate text-[13.5px] font-medium text-ink">
                        {c.unread && (
                          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-warm" />
                        )}
                        {c.name}
                      </p>
                      <p className="truncate text-[12.5px] text-mute">{c.preview}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-mono text-[10px] text-mute">
                        {formatRelative(c.lastAt)}
                      </span>
                      <Pill cls={c.tag.cls}>{c.tag.label}</Pill>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

function Pill({
  cls,
  children,
}: {
  cls: InboxListItem['tag']['cls'];
  children: React.ReactNode;
}) {
  const map = {
    auto: 'bg-mint-soft text-mint',
    approve: 'bg-amber-soft text-amber',
    escalate: 'bg-[hsl(var(--rose)/0.1)] text-rose',
    growth: 'bg-warm-soft text-warm',
    neutral: 'bg-paper-2 text-ink-2',
  } as const;
  return (
    <span
      className={`rounded-full px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wide ${map[cls]}`}
    >
      {children}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-mute"
    >
      <path d="M21 21l-4.35-4.35" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
