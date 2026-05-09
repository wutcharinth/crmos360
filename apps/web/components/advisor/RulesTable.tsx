'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { MockAdvisorRule } from '@/lib/mocks/types';

type SortKey = 'name' | 'source' | 'appliedCount' | 'lastAppliedAt' | 'status';
type SortDir = 'asc' | 'desc';

function fmtRelative(iso: string | null): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const STATUS_CLASS: Record<MockAdvisorRule['status'], string> = {
  active: 'bg-mint-soft text-mint',
  pending: 'bg-warm-soft text-warm',
  disabled: 'bg-paper-3 text-mute',
};

export function RulesTable({ rules }: { rules: MockAdvisorRule[] }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: 'appliedCount',
    dir: 'desc',
  });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let r = rules.filter((rule) => {
      if (!q) return true;
      return (
        rule.name.toLowerCase().includes(q) ||
        rule.condition.toLowerCase().includes(q) ||
        rule.action.toLowerCase().includes(q) ||
        rule.source.includes(q)
      );
    });
    r = [...r].sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1;
      switch (sort.key) {
        case 'name':
          return a.name.localeCompare(b.name) * dir;
        case 'source':
          return a.source.localeCompare(b.source) * dir;
        case 'appliedCount':
          return (a.appliedCount - b.appliedCount) * dir;
        case 'lastAppliedAt':
          return (
            (new Date(a.lastAppliedAt ?? 0).getTime() -
              new Date(b.lastAppliedAt ?? 0).getTime()) *
            dir
          );
        case 'status':
          return a.status.localeCompare(b.status) * dir;
      }
    });
    return r;
  }, [rules, query, sort]);

  const setSortKey = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: key === 'appliedCount' || key === 'lastAppliedAt' ? 'desc' : 'asc' },
    );
  };

  const arrow = (key: SortKey) => {
    if (sort.key !== key) return '';
    return sort.dir === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search rules by name, condition, or source…"
          className="h-9 w-full max-w-sm rounded-md border border-hairline bg-paper px-3 text-[13px] text-ink placeholder:text-mute focus:border-warm focus:outline-none focus:ring-1 focus:ring-warm"
        />
        <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
          {rows.length} of {rules.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-hairline bg-paper">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-paper-2/60">
            <tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
              <Th onClick={() => setSortKey('name')}>Name{arrow('name')}</Th>
              <Th onClick={() => setSortKey('source')}>Source{arrow('source')}</Th>
              <Th onClick={() => setSortKey('appliedCount')} align="right">
                Applied{arrow('appliedCount')}
              </Th>
              <Th onClick={() => setSortKey('lastAppliedAt')} align="right">
                Last fired{arrow('lastAppliedAt')}
              </Th>
              <Th onClick={() => setSortKey('status')}>Status{arrow('status')}</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-mute">
                  No rules match &ldquo;{query}&rdquo;.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-paper-2/40">
                  <td className="px-4 py-3 align-top">
                    <Link
                      href={`/advisor/${r.id}`}
                      className="font-medium text-ink hover:text-warm"
                    >
                      {r.name}
                    </Link>
                    <p className="mt-0.5 line-clamp-1 font-mono text-[11px] text-ink-2">
                      {r.condition}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-ink-2">
                      {r.source}
                    </span>
                    {r.sourceId && (
                      <p className="font-mono text-[10px] text-mute">{r.sourceId}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right align-top tabular-nums">
                    {r.appliedCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right align-top font-mono text-[11px] tabular-nums text-ink-2">
                    {fmtRelative(r.lastAppliedAt)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span
                      className={`inline-flex h-6 items-center rounded-full px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] ${STATUS_CLASS[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({
  children,
  onClick,
  align = 'left',
}: {
  children: React.ReactNode;
  onClick: () => void;
  align?: 'left' | 'right';
}) {
  return (
    <th
      scope="col"
      className={`select-none px-4 py-3 font-medium ${align === 'right' ? 'text-right' : 'text-left'}`}
    >
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 hover:text-ink"
      >
        {children}
      </button>
    </th>
  );
}
