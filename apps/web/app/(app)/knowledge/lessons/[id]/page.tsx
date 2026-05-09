import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLesson, getConversation } from '@/lib/api';
import type { MockLesson } from '@/lib/mocks/types';

export const dynamic = 'force-dynamic';

const STATUS_STYLES: Record<MockLesson['status'], string> = {
  pending: 'bg-warm-soft text-warm',
  approved: 'bg-mint-soft text-mint',
  rejected: 'bg-paper-3 text-rose',
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = await getLesson(id);
  if (!lesson) notFound();

  const sourceConv = lesson.sourceConversationId
    ? await getConversation(lesson.sourceConversationId)
    : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10 lg:py-14">
      {/* Crumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-baseline gap-x-2 font-mono text-[10px] uppercase tracking-[0.14em] text-mute"
      >
        <Link href="/knowledge" className="hover:text-warm">
          Knowledge
        </Link>
        <span>/</span>
        <Link href="/knowledge/lessons" className="hover:text-warm">
          Lessons
        </Link>
        <span>/</span>
        <span className="text-ink-2">{lesson.id}</span>
      </nav>

      <div className="mt-6 grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_260px]">
        {/* Body */}
        <article className="space-y-12">
          {/* Lede */}
          <header>
            <p className="label-mono">Lesson · auto-extracted</p>
            <h1 className="mt-4 text-[clamp(24px,3vw,36px)] font-semibold leading-[1.12] tracking-tight text-ink">
              {lesson.statement}
            </h1>
          </header>

          {/* Reasoning */}
          <section>
            <p className="label-mono">AI reasoning</p>
            <p className="mt-4 max-w-[64ch] text-[15px] leading-relaxed text-ink-2">
              {lesson.reasoning}
            </p>
          </section>

          {/* Suggested rule */}
          {lesson.suggestedRule && (
            <section>
              <p className="label-mono">Suggested rule</p>
              <div className="mt-4 space-y-3 rounded-md border border-hairline bg-paper-2/50 p-5 font-mono text-[13px] leading-relaxed text-ink-2">
                <p>
                  <span className="text-warm">if</span>{' '}
                  <span className="text-ink">{lesson.suggestedRule.condition}</span>
                </p>
                <p>
                  <span className="text-warm">then</span>{' '}
                  <span className="text-ink">{lesson.suggestedRule.action}</span>
                </p>
              </div>
            </section>
          )}

          {/* Source thread */}
          <section>
            <p className="label-mono">Source thread</p>
            {sourceConv ? (
              <div className="mt-4">
                <Link
                  href={`/inbox/${sourceConv.id}`}
                  className="inline-flex items-center gap-2 text-[13.5px] text-warm hover:underline"
                >
                  Open conversation {sourceConv.id}{' '}
                  <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                    · {sourceConv.channel}
                  </span>
                  →
                </Link>
                <ul className="mt-4 space-y-2 border-l border-hairline pl-5 text-[13.5px] leading-relaxed text-ink-2">
                  {sourceConv.messages.slice(-5).map((m) => (
                    <li key={m.id}>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                        {m.direction === 'inbound' ? 'in' : 'out'} ·{' '}
                      </span>
                      {m.body}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-4 text-[13.5px] text-mute">
                No single source conversation — pattern aggregated across multiple threads.
              </p>
            )}
          </section>

          {/* Action row */}
          <section className="flex flex-wrap items-center gap-3 border-t border-hairline pt-7">
            <Link
              href={`/advisor?source=lesson:${lesson.id}`}
              className="rounded-md bg-warm px-4 py-2 text-[13px] font-medium text-paper hover:opacity-90"
            >
              Promote to rule →
            </Link>
            <button
              type="button"
              disabled={lesson.status === 'approved'}
              className="rounded-md border border-hairline bg-paper px-3.5 py-2 text-[13px] text-ink hover:border-warm/40 hover:text-warm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Approve
            </button>
            <button
              type="button"
              disabled={lesson.status === 'rejected'}
              className="rounded-md border border-hairline bg-paper px-3.5 py-2 text-[13px] text-ink hover:border-rose/40 hover:text-rose disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reject
            </button>
            <button
              type="button"
              className="rounded-md border border-hairline bg-paper px-3.5 py-2 text-[13px] text-ink hover:border-warm/40 hover:text-warm"
            >
              Edit
            </button>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="space-y-7 lg:border-l lg:border-hairline lg:pl-9">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              Status
            </p>
            <span
              className={`mt-2 inline-flex h-6 items-center justify-center rounded-full px-3 font-mono text-[10px] uppercase tracking-[0.14em] ${STATUS_STYLES[lesson.status]}`}
            >
              {lesson.status}
            </span>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              Created
            </p>
            <p className="mt-1.5 text-[13px] text-ink-2">{fmtDate(lesson.createdAt)}</p>
          </div>

          {lesson.approvedAt && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                {lesson.status === 'approved' ? 'Approved' : 'Decided'}
              </p>
              <p className="mt-1.5 text-[13px] text-ink-2">{fmtDate(lesson.approvedAt)}</p>
              {lesson.approvedByName && (
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                  by {lesson.approvedByName}
                </p>
              )}
            </div>
          )}

          {lesson.sourceConversationId && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                Source ref
              </p>
              <Link
                href={`/inbox/${lesson.sourceConversationId}`}
                className="mt-1.5 block font-mono text-[12px] text-warm hover:underline"
              >
                {lesson.sourceConversationId} →
              </Link>
            </div>
          )}

          <div className="border-t border-hairline pt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              Nearby
            </p>
            <ul className="mt-3 space-y-2 text-[12.5px]">
              <li>
                <Link href="/knowledge/lessons" className="text-ink-2 hover:text-warm">
                  All lessons →
                </Link>
              </li>
              <li>
                <Link href="/advisor" className="text-ink-2 hover:text-warm">
                  Configuration Advisor →
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
