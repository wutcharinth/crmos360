import Link from 'next/link';
import { listLessons } from '@/lib/api';
import { LessonCard } from '@/components/knowledge/LessonCard';
import type { MockLesson } from '@/lib/mocks/types';

export const dynamic = 'force-dynamic';

const STATUS_FILTERS: { value: 'all' | MockLesson['status']; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export default async function LessonsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusParam = (params.status ?? 'all') as 'all' | MockLesson['status'];

  const lessons = await listLessons(
    statusParam === 'all' ? undefined : statusParam,
  );
  const all = await listLessons();

  const counts = {
    all: all.length,
    pending: all.filter((l) => l.status === 'pending').length,
    approved: all.filter((l) => l.status === 'approved').length,
    rejected: all.filter((l) => l.status === 'rejected').length,
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:px-10 lg:py-16">
      <header>
        <p className="label-mono">Knowledge · lessons</p>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,42px)] font-semibold tracking-tight text-ink">
          Auto-extracted{' '}
          <em className="not-italic font-semibold text-warm">lessons</em>
        </h1>
        <p className="lead mt-3 max-w-[58ch]">
          Patterns the AI noticed from human edits. Each pending lesson can be approved into
          a Configuration Advisor rule, edited, or rejected.
        </p>
      </header>

      {/* Underline-on-active tabs (matches /admin/prospects) */}
      <div className="mt-9 flex items-center gap-1 border-b border-hairline">
        {STATUS_FILTERS.map((f) => {
          const active = f.value === statusParam;
          const n =
            f.value === 'all'
              ? counts.all
              : f.value === 'pending'
                ? counts.pending
                : f.value === 'approved'
                  ? counts.approved
                  : counts.rejected;
          return (
            <Link
              key={f.value}
              href={
                f.value === 'all'
                  ? '/knowledge/lessons'
                  : `/knowledge/lessons?status=${f.value}`
              }
              className={`relative px-3 py-2.5 text-[13px] font-medium transition-colors ${
                active ? 'text-ink' : 'text-mute hover:text-ink'
              }`}
            >
              {f.label}{' '}
              <span className="font-mono text-[10px] tabular-nums text-mute">{n}</span>
              {active && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 bg-warm" aria-hidden />
              )}
            </Link>
          );
        })}
        <span className="ml-auto px-3 py-2.5">
          <Link
            href="/knowledge"
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute hover:text-warm"
          >
            ← Two-pane view
          </Link>
        </span>
      </div>

      {lessons.length === 0 ? (
        <div className="mt-9 rounded-lg border border-dashed border-hairline bg-paper-2/40 px-7 py-14 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            No {statusParam === 'all' ? '' : statusParam} lessons
          </p>
          <p className="mt-2 text-[13.5px] text-ink-2">
            Lessons appear after the team edits AI replies in the inbox.
          </p>
        </div>
      ) : (
        <ul className="mt-7 divide-y divide-hairline overflow-hidden rounded-lg border border-hairline bg-paper">
          {lessons.map((l) => (
            <li key={l.id}>
              <LessonCard lesson={l} href={`/knowledge/lessons/${l.id}`} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
