import Link from 'next/link';
import { listLessons, getLesson, getConversation } from '@/lib/api';
import { ArticleTree } from '@/components/knowledge/ArticleTree';
import { LessonCard } from '@/components/knowledge/LessonCard';
import type { MockLesson } from '@/lib/mocks/types';

export const dynamic = 'force-dynamic';

interface SearchParams {
  lesson?: string;
  pane?: 'kb' | 'lessons';
}

export default async function KnowledgePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const allLessons = await listLessons();

  // Default selection: explicit ?lesson, else newest pending, else newest overall.
  const selectedId =
    params.lesson ??
    allLessons.find((l) => l.status === 'pending')?.id ??
    allLessons[0]?.id;

  const selected = selectedId ? await getLesson(selectedId) : null;
  const sourceConv = selected?.sourceConversationId
    ? await getConversation(selected.sourceConversationId)
    : null;

  const counts = {
    pending: allLessons.filter((l) => l.status === 'pending').length,
    approved: allLessons.filter((l) => l.status === 'approved').length,
    rejected: allLessons.filter((l) => l.status === 'rejected').length,
  };

  const mobilePane = params.pane ?? 'lessons';

  return (
    <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
      {/* Page lede — editorial composition */}
      <header className="py-12 lg:py-16">
        <p className="label-mono">Knowledge · M1.5</p>
        <h1 className="mt-4 text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.08] tracking-tight text-ink">
          Knowledge base{' '}
          <em className="not-italic font-semibold text-warm">+ lessons</em>
        </h1>
        <p className="lead mt-4 max-w-[60ch]">
          Curated articles plus auto-extracted lessons from team edits. Each approved lesson
          can be promoted into a Configuration Advisor rule that runs against future inbound.
        </p>

        {/* Inline kerned counts — not hero-metric tiles */}
        <div className="mt-7 flex flex-wrap items-baseline gap-x-9 gap-y-2 font-mono text-[12px] text-mute">
          <span>
            <span className="text-[22px] font-semibold tabular-nums text-warm">
              {counts.pending}
            </span>{' '}
            pending
          </span>
          <span>
            <span className="text-[22px] font-semibold tabular-nums text-mint">
              {counts.approved}
            </span>{' '}
            approved
          </span>
          <span>
            <span className="text-[22px] font-semibold tabular-nums text-ink-2">
              {counts.rejected}
            </span>{' '}
            rejected
          </span>
          <span className="ml-auto">
            <Link href="/knowledge/lessons" className="hover:text-warm">
              Full list →
            </Link>
          </span>
        </div>
      </header>

      {/* Mobile pane toggle (sm only) */}
      <div className="mb-4 flex items-center gap-1 border-b border-hairline lg:hidden">
        {(['kb', 'lessons'] as const).map((p) => {
          const active = mobilePane === p;
          return (
            <Link
              key={p}
              href={`/knowledge?pane=${p}${selectedId ? `&lesson=${selectedId}` : ''}`}
              className={`relative px-4 py-2.5 text-[13px] font-medium ${active ? 'text-ink' : 'text-mute hover:text-ink'}`}
            >
              {p === 'kb' ? 'Articles' : 'Lessons'}
              {active && (
                <span className="absolute inset-x-4 bottom-0 h-0.5 bg-warm" aria-hidden />
              )}
            </Link>
          );
        })}
      </div>

      {/* Two-pane layout — asymmetric (rail + body), not equal columns */}
      <div className="grid gap-x-10 gap-y-10 pb-16 lg:grid-cols-[280px_1fr]">
        {/* Left rail */}
        <aside
          className={`space-y-9 ${mobilePane === 'kb' ? 'block' : 'hidden'} lg:block`}
        >
          <section>
            <p className="label-mono mb-4">Articles</p>
            <ArticleTree />
          </section>
          <section>
            <p className="label-mono mb-3">Pending lessons</p>
            <div className="-mx-3 divide-y divide-hairline">
              {allLessons
                .filter((l) => l.status === 'pending')
                .slice(0, 5)
                .map((l) => (
                  <LessonCard
                    key={l.id}
                    lesson={l}
                    href={`/knowledge?lesson=${l.id}`}
                    active={l.id === selectedId}
                    variant="compact"
                  />
                ))}
            </div>
          </section>
        </aside>

        {/* Right pane — lesson detail */}
        <main className={mobilePane === 'lessons' ? 'block' : 'hidden lg:block'}>
          {selected ? (
            <LessonDetailInline lesson={selected} sourceConvPreview={sourceConv} />
          ) : (
            <div className="rounded-lg border border-dashed border-hairline bg-paper-2/40 px-7 py-14 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                No lessons yet
              </p>
              <p className="mt-2 text-[13.5px] text-ink-2">
                Lessons surface here automatically after the team edits AI replies.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// — Inline detail view ————————————————————————————————————————————————

interface SourceConvPreview {
  id: string;
  channel: string;
  messages: { id: string; direction: string; body: string }[];
}

function LessonDetailInline({
  lesson,
  sourceConvPreview,
}: {
  lesson: MockLesson;
  sourceConvPreview: SourceConvPreview | null;
}) {
  return (
    <article className="space-y-9">
      <div className="flex items-baseline justify-between gap-4">
        <p className="label-mono">Lesson · {lesson.id}</p>
        <Link
          href={`/knowledge/lessons/${lesson.id}`}
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute hover:text-warm"
        >
          Open detail →
        </Link>
      </div>

      <h2 className="text-[clamp(20px,2.4vw,28px)] font-medium leading-tight tracking-tight text-ink">
        {lesson.statement}
      </h2>

      <div className="grid gap-x-9 gap-y-7 sm:grid-cols-[auto_1fr]">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute sm:pt-1">
          Reasoning
        </p>
        <p className="text-[14px] leading-relaxed text-ink-2">{lesson.reasoning}</p>

        {lesson.suggestedRule && (
          <>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute sm:pt-1">
              Suggested rule
            </p>
            <div className="space-y-2 font-mono text-[12.5px] leading-relaxed text-ink-2">
              <p>
                <span className="text-warm">if</span> {lesson.suggestedRule.condition}
              </p>
              <p>
                <span className="text-warm">then</span> {lesson.suggestedRule.action}
              </p>
            </div>
          </>
        )}

        {sourceConvPreview && (
          <>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute sm:pt-1">
              Source thread
            </p>
            <div>
              <Link
                href={`/inbox/${sourceConvPreview.id}`}
                className="inline-flex items-center gap-2 text-[13px] text-warm hover:underline"
              >
                {sourceConvPreview.id}{' '}
                <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                  · {sourceConvPreview.channel}
                </span>
                →
              </Link>
              <ul className="mt-3 space-y-1.5 border-l border-hairline pl-4 text-[13px] text-ink-2">
                {sourceConvPreview.messages.slice(-3).map((m) => (
                  <li key={m.id}>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                      {m.direction === 'inbound' ? 'in' : 'out'} ·{' '}
                    </span>
                    {m.body}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-hairline pt-7">
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
      </div>
    </article>
  );
}
