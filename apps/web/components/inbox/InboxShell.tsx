import type { ReactNode } from 'react';

/**
 * Inbox workspace shell.
 *
 * 4-column grid lifted from the FlowAIOS Inbox prototype:
 *   [220 sidebar] [320 list] [flex thread] [320 context]
 *
 * Responsive collapse:
 *   ≤1280px → [200 280 1fr 280]
 *   ≤1080px → [64 280 1fr]   (context drops, sidebar collapses to icons)
 *   ≤820px  → [64 1fr]       (list drops on the smallest tier; route to /[id])
 *
 * Layout fills the viewport (h-screen) and clips overflow at the shell so
 * each column scrolls independently. Background tones + dividers match
 * the prototype's slate-on-paper hierarchy: bg=paper, panels=paper,
 * dividers=hairline.
 */
export function InboxShell({
  sidebar,
  list,
  thread,
  context,
}: {
  sidebar: ReactNode;
  list: ReactNode;
  thread: ReactNode;
  context?: ReactNode;
}) {
  return (
    <div className="grid h-full min-h-0 flex-1 overflow-hidden bg-paper text-[14px] grid-cols-[64px_1fr] md:grid-cols-[64px_280px_1fr] xl:grid-cols-[200px_280px_1fr_280px] 2xl:grid-cols-[220px_320px_1fr_320px]">
      <div className="overflow-y-auto border-r border-hairline bg-paper">{sidebar}</div>
      <div className="hidden overflow-hidden border-r border-hairline bg-paper md:flex md:flex-col">
        {list}
      </div>
      <div className="flex min-w-0 flex-col overflow-hidden bg-paper-2/40">{thread}</div>
      {context && (
        <div className="hidden overflow-y-auto border-l border-hairline bg-paper xl:block">
          {context}
        </div>
      )}
    </div>
  );
}
