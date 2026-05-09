import Link from 'next/link';
import { listThreads, listMessages } from '@/lib/concierge/store';

export const dynamic = 'force-dynamic';

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  });
}

export default function JailbreakPage() {
  const threads = listThreads();
  const flagged: { thread: ReturnType<typeof listThreads>[number]; messageBody: string; messageAt: string; messageId: string }[] = [];
  for (const t of threads) {
    for (const m of listMessages(t.id)) {
      if (m.flagged === 'jailbreak') {
        flagged.push({ thread: t, messageBody: m.body, messageAt: m.createdAt, messageId: m.id });
      }
    }
  }
  flagged.sort((a, b) => new Date(b.messageAt).getTime() - new Date(a.messageAt).getTime());

  return (
    <div className="mx-auto max-w-5xl space-y-9 px-8 py-10">
      <header>
        <p className="label-mono">Admin · jailbreak log</p>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,42px)] font-semibold tracking-tight text-ink">
          Prompt-injection attempts
        </h1>
        <p className="lead mt-3 max-w-[58ch]">
          Inbound messages flagged by the concierge for matching common prompt-injection
          patterns. Detection is heuristic and intentionally permissive; review and use the
          signal to tighten rules.
        </p>
      </header>

      {flagged.length === 0 ? (
        <div className="rounded-lg border border-dashed border-hairline bg-paper-2/40 px-5 py-14 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">Quiet</p>
          <p className="mt-2 text-[13px] text-ink-2">No flagged messages this session.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {flagged.map((f) => (
            <li key={f.messageId} className="rounded-lg border border-hairline bg-paper p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-rose">
                  jailbreak · {fmtTime(f.messageAt)}
                </p>
                <Link
                  href={`/admin/prospects/${f.thread.id}`}
                  className="font-mono text-[10px] uppercase tracking-widest text-mute hover:text-warm"
                >
                  thread {f.thread.id.slice(0, 8)} →
                </Link>
              </div>
              <p className="mt-3 text-[13.5px] italic leading-relaxed text-ink">
                &ldquo;{f.messageBody}&rdquo;
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-mute">
                {f.thread.email ?? `session ${f.thread.sessionId.slice(0, 10)}`} ·{' '}
                {f.thread.vertical ?? 'unset'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
