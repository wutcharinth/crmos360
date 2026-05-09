import Link from 'next/link';
import { type ReactNode } from 'react';

interface ComingSoonProps {
  title: string;
  kicker: string;
  description: string;
  features: string[];
  chunkId: string;
  children?: ReactNode;
}

/**
 * Editorial placeholder for in-app surfaces shipping in Phase 3 of the M1.5
 * build plan. Reads as a magazine-style "coming next" page rather than a
 * generic empty-state card.
 */
export function ComingSoon({
  title,
  kicker,
  description,
  features,
  chunkId,
  children,
}: ComingSoonProps) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <div className="grid gap-x-12 gap-y-9 md:grid-cols-[1fr_auto]">
        {/* Lede */}
        <div>
          <p className="label-mono">{kicker}</p>
          <h1 className="mt-4 text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.08] tracking-tight text-ink">
            {title}
          </h1>
          <p className="lead mt-5 max-w-[58ch]">{description}</p>
        </div>

        {/* Stage marker */}
        <aside className="self-start md:pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Build stage
          </p>
          <p className="mt-2 font-mono text-[12px] text-warm">
            M1.5 · {chunkId}
          </p>
          <p className="mt-1 text-[12px] text-mute">Phase 3 prototype</p>
        </aside>
      </div>

      {/* What ships — inline list, no card chrome */}
      <section className="mt-16 border-t border-hairline pt-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          What ships here
        </p>
        <ol className="mt-5 space-y-4">
          {features.map((f, i) => (
            <li key={f} className="flex gap-5 text-[14.5px] leading-relaxed text-ink-2">
              <span className="flex-shrink-0 font-mono text-[12px] tabular-nums text-warm">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ol>
      </section>

      {children ? <section className="mt-12">{children}</section> : null}

      {/* Footer pointers — links to nearby surfaces */}
      <footer className="mt-14 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-hairline pt-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          Nearby
        </p>
        <Link
          href="/inbox"
          className="text-[13px] text-ink-2 underline-offset-4 hover:text-warm hover:underline"
        >
          Inbox · M1.2 (shipped) →
        </Link>
        <Link
          href="/dev/skin"
          className="text-[13px] text-ink-2 underline-offset-4 hover:text-warm hover:underline"
        >
          /dev/skin · token QA →
        </Link>
        <Link
          href="/settings/appearance"
          className="text-[13px] text-ink-2 underline-offset-4 hover:text-warm hover:underline"
        >
          Settings · skin toggle →
        </Link>
      </footer>
    </main>
  );
}
