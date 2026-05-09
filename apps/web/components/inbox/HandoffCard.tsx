/**
 * Conversation handoff card — surfaced at the top of an escalated thread.
 *
 * Born out of Q14 in the Pim and Nat persona interviews ("when AI hands
 * to a human, the human arrives blind"). The card delivers four things
 * in a single glance: a compressed summary, the AI's reasoning for
 * escalating, a suggested reply with confidence, and the customer
 * memory snippets relevant to this thread.
 *
 * Render only when conversation.status is 'escalated' (mock) or when
 * the most recent AI confidence dropped below threshold mid-thread.
 */

import Link from 'next/link';

interface HandoffCardProps {
  /** 2–4 bullet points compressing the conversation so far */
  summary: string[];
  /** Why the AI escalated, in one sentence */
  reasoning: string;
  /** Optional suggested reply the human can send with one click */
  suggestedReply?: { body: string; confidence: number };
  /** Customer memory snippets relevant to this thread */
  relevantMemory: { id: string; kind: 'fact' | 'summary' | 'note'; content: string }[];
  /** Currently assigned human, if any */
  assigneeName: string | null;
  /** Action handlers — wired by the page */
  takeoverHref?: string;
  composeHref?: string;
}

export function HandoffCard({
  summary,
  reasoning,
  suggestedReply,
  relevantMemory,
  assigneeName,
  takeoverHref,
  composeHref,
}: HandoffCardProps) {
  return (
    <section
      aria-label="Conversation handoff"
      className="overflow-hidden rounded-xl border border-warm/40 bg-warm-soft/40"
    >
      <header className="flex items-baseline justify-between gap-3 border-b border-warm/20 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-warm opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-warm" />
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm">
            Handoff · awaiting you
          </p>
        </div>
        {assigneeName && (
          <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
            assigned · {assigneeName}
          </p>
        )}
      </header>

      <div className="grid gap-x-9 gap-y-6 px-5 py-5 lg:grid-cols-[1fr_280px]">
        {/* Left column — summary + reasoning + suggested reply */}
        <div className="space-y-5 min-w-0">
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              Summary
            </p>
            <ul className="mt-2 space-y-1.5">
              {summary.map((line, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink"
                >
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-warm" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              Why escalated
            </p>
            <p className="mt-2 text-[13.5px] italic leading-relaxed text-ink-2">
              {reasoning}
            </p>
          </section>

          {suggestedReply && (
            <section>
              <div className="flex items-baseline gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                  Suggested reply
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                    suggestedReply.confidence >= 0.85
                      ? 'bg-mint-soft text-mint'
                      : suggestedReply.confidence >= 0.6
                        ? 'bg-warm-soft text-warm'
                        : 'bg-paper-3 text-mute'
                  }`}
                >
                  {Math.round(suggestedReply.confidence * 100)}% confidence
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap rounded-lg border border-hairline bg-paper px-4 py-3 text-[13.5px] leading-relaxed text-ink">
                {suggestedReply.body}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-md bg-warm px-4 py-2 text-[12.5px] font-medium text-paper transition-colors hover:bg-warm-2"
                >
                  Send as is
                </button>
                <Link
                  href={composeHref ?? '#compose'}
                  className="rounded-md border border-hairline bg-paper px-3.5 py-2 text-[12.5px] font-medium text-ink hover:border-warm/40 hover:text-warm"
                >
                  Edit before sending
                </Link>
                {takeoverHref && (
                  <Link
                    href={takeoverHref}
                    className="rounded-md px-3.5 py-2 text-[12.5px] font-medium text-ink-2 hover:text-ink"
                  >
                    Take over silently
                  </Link>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Right column — relevant memory */}
        <aside className="lg:border-l lg:border-warm/20 lg:pl-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Relevant memory
          </p>
          {relevantMemory.length === 0 ? (
            <p className="mt-3 text-[12.5px] text-mute">
              No memory facts on file for this customer yet.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {relevantMemory.map((m) => (
                <li key={m.id}>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-warm">
                    {m.kind}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-ink-2">
                    {m.content}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </section>
  );
}
