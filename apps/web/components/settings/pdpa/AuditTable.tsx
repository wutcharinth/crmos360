'use client';

import { useMemo, useState } from 'react';
import type { MockAuditLogEntry } from '@/lib/mocks/types';

type ActorFilter = 'all' | 'ai' | 'user' | 'system';

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.round(d / 30);
  return `${mo}mo ago`;
}

function actorPillClass(t: MockAuditLogEntry['actorType']): string {
  if (t === 'ai') return 'bg-warm-soft text-warm border-warm/30';
  if (t === 'user') return 'bg-mint-soft text-mint border-mint/30';
  return 'bg-paper-3 text-ink-2 border-hairline-2';
}

function toCsv(rows: MockAuditLogEntry[]): string {
  const header = ['id', 'created_at', 'actor_type', 'actor_name', 'action', 'resource_type', 'resource_id'];
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.createdAt,
        r.actorType,
        `"${r.actorName.replace(/"/g, '""')}"`,
        r.action,
        r.resourceType,
        r.resourceId ?? '',
      ].join(','),
    );
  }
  return lines.join('\n');
}

export interface AuditTableProps {
  entries: MockAuditLogEntry[];
}

export function AuditTable({ entries }: AuditTableProps) {
  const [actor, setActor] = useState<ActorFilter>('all');
  const [action, setAction] = useState<string>('all');
  const [date, setDate] = useState<'all' | '24h' | '7d' | '30d'>('all');

  const actions = useMemo(() => {
    return ['all', ...Array.from(new Set(entries.map((e) => e.action))).sort()];
  }, [entries]);

  const visible = useMemo(() => {
    const cutoff =
      date === '24h'
        ? Date.now() - 24 * 60 * 60_000
        : date === '7d'
          ? Date.now() - 7 * 24 * 60 * 60_000
          : date === '30d'
            ? Date.now() - 30 * 24 * 60 * 60_000
            : 0;
    return entries.filter((e) => {
      if (actor !== 'all' && e.actorType !== actor) return false;
      if (action !== 'all' && e.action !== action) return false;
      if (cutoff && new Date(e.createdAt).getTime() < cutoff) return false;
      return true;
    });
  }, [entries, actor, action, date]);

  const onExport = () => {
    const csv = toCsv(visible);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowaios-audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-hairline bg-paper-2">
      <div className="flex flex-wrap items-center gap-3 border-b border-hairline px-4 py-3">
        <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
          actor
          <select
            value={actor}
            onChange={(e) => setActor(e.target.value as ActorFilter)}
            className="rounded-md border border-hairline bg-paper px-2 py-1 font-sans text-[12px] normal-case tracking-normal text-ink"
          >
            <option value="all">all</option>
            <option value="ai">ai</option>
            <option value="user">user</option>
            <option value="system">system</option>
          </select>
        </label>
        <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
          action
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="rounded-md border border-hairline bg-paper px-2 py-1 font-sans text-[12px] normal-case tracking-normal text-ink"
          >
            {actions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
          range
          <select
            value={date}
            onChange={(e) => setDate(e.target.value as typeof date)}
            className="rounded-md border border-hairline bg-paper px-2 py-1 font-sans text-[12px] normal-case tracking-normal text-ink"
          >
            <option value="all">all</option>
            <option value="24h">last 24h</option>
            <option value="7d">last 7d</option>
            <option value="30d">last 30d</option>
          </select>
        </label>
        <span className="font-mono text-[11px] text-mute">
          {visible.length} / {entries.length} rows
        </span>
        <button
          type="button"
          onClick={onExport}
          className="ml-auto rounded-md border border-hairline bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink hover:border-warm hover:text-warm"
        >
          Export CSV
        </button>
      </div>

      <div className="max-h-[480px] overflow-auto">
        <table className="w-full text-left text-[13px]">
          <thead className="sticky top-0 z-10 bg-paper-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-mute">
            <tr className="border-b border-hairline">
              <th className="px-4 py-2 font-medium">when</th>
              <th className="px-4 py-2 font-medium">actor</th>
              <th className="px-4 py-2 font-medium">action</th>
              <th className="px-4 py-2 font-medium">resource</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-[12px] text-mute">
                  No entries match the current filter.
                </td>
              </tr>
            ) : (
              visible.map((e) => (
                <tr key={e.id} className="border-b border-hairline/60 last:border-b-0 hover:bg-paper">
                  <td className="px-4 py-2 font-mono text-[11.5px] text-ink-2 tabular-nums">
                    {relTime(e.createdAt)}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${actorPillClass(
                        e.actorType,
                      )}`}
                    >
                      {e.actorType}
                    </span>
                    <span className="ml-2 text-[12px] text-ink-2">{e.actorName}</span>
                  </td>
                  <td className="px-4 py-2 font-mono text-[12px] text-ink">{e.action}</td>
                  <td className="px-4 py-2 font-mono text-[11.5px] text-mute">
                    {e.resourceType}
                    {e.resourceId ? ` · ${e.resourceId}` : ''}
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
