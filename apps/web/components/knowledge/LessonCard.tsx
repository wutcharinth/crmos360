import Link from 'next/link';
import type { MockLesson } from '@/lib/mocks/types';

type Variant = 'row' | 'compact';

interface LessonCardProps {
  lesson: MockLesson;
  href?: string;
  active?: boolean;
  variant?: Variant;
}

const STATUS_STYLES: Record<MockLesson['status'], string> = {
  pending: 'bg-warm-soft text-warm',
  approved: 'bg-mint-soft text-mint',
  rejected: 'bg-paper-3 text-rose',
};

const STATUS_LABEL: Record<MockLesson['status'], string> = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
};

function fmtDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${Math.max(m, 1)}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 14) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

/**
 * Row in the lesson list. Used both in the standalone list page and the
 * left-rail mini-list. Status pill, statement (1-line clamp), suggested-rule
 * preview in mono, source-conv handle, approver if present.
 */
export function LessonCard({ lesson, href, active = false, variant = 'row' }: LessonCardProps) {
  const compact = variant === 'compact';
  const Wrapper: 'div' | typeof Link = href ? Link : 'div';
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className={[
        'group block w-full text-left transition-colors',
        compact ? 'px-4 py-4' : 'px-5 py-5',
        active ? 'bg-paper-2' : href ? 'hover:bg-paper-2' : '',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 inline-flex h-5 flex-shrink-0 items-center justify-center rounded-full px-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] ${STATUS_STYLES[lesson.status]}`}
        >
          {STATUS_LABEL[lesson.status]}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={`line-clamp-1 font-medium text-ink ${compact ? 'text-[13px]' : 'text-[14px]'}`}
          >
            {lesson.statement}
          </p>
          {lesson.suggestedRule && !compact && (
            <p className="mt-2 line-clamp-1 font-mono text-[11.5px] text-mute">
              <span className="text-warm">if</span> {lesson.suggestedRule.condition}{' '}
              <span className="text-warm">→</span> {lesson.suggestedRule.action}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
            <span>{fmtDate(lesson.createdAt)}</span>
            {lesson.sourceConversationId && (
              <span>
                src · <span className="text-ink-2">{lesson.sourceConversationId}</span>
              </span>
            )}
            {lesson.approvedByName && <span>by · {lesson.approvedByName}</span>}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
