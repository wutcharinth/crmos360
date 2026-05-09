import type { ReactNode } from 'react';

interface SettingSectionProps {
  kicker: string;
  title: string;
  description?: string;
  children: ReactNode;
  /** Render a horizontal rule above this section. Defaults to true. */
  rule?: boolean;
}

/**
 * Editorial section wrapper for settings pages. Two-column layout: lede on
 * the left (kicker + title + description), control on the right. Rules
 * between sections — explicitly NOT a card grid.
 */
export function SettingSection({
  kicker,
  title,
  description,
  children,
  rule = true,
}: SettingSectionProps) {
  return (
    <section
      className={
        rule
          ? 'border-t border-hairline pt-10 mt-10 grid gap-x-12 gap-y-6 md:grid-cols-[minmax(0,18rem)_1fr]'
          : 'grid gap-x-12 gap-y-6 md:grid-cols-[minmax(0,18rem)_1fr]'
      }
    >
      <div>
        <p className="label-mono">{kicker}</p>
        <h2 className="mt-2 text-[20px] font-semibold tracking-tight text-ink">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
            {description}
          </p>
        ) : null}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
