export const dynamic = 'force-dynamic';

export default function ApprovalsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-9 px-8 py-10">
      <header>
        <p className="label-mono">Admin · approvals</p>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,42px)] font-semibold tracking-tight text-ink">
          Human-in-the-loop approvals
        </h1>
        <p className="lead mt-3 max-w-[58ch]">
          Suspended tool calls, pending memory facts, lesson candidates, and any AI action
          that needs human sign-off before it runs. Generic protocol, used by every agent.
        </p>
      </header>

      <div className="rounded-lg border border-dashed border-hairline bg-paper-2/40 px-5 py-14 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          Empty queue
        </p>
        <p className="mt-2 text-[13px] text-ink-2">
          No agents are currently waiting on a human decision. The queue lights up when:
        </p>
        <ul className="mx-auto mt-4 max-w-md space-y-1.5 text-left text-[13px] text-ink-2">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-warm" />
            <span>Memory mode is set to &ldquo;approval&rdquo; and the extractor proposes a fact</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-warm" />
            <span>The lesson extractor surfaces a generalizable pattern</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-warm" />
            <span>The Configuration Advisor proposes a new auto-reply rule</span>
          </li>
        </ul>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          Wires up in M1.5 · Chunks 15, 17
        </p>
      </div>
    </div>
  );
}
