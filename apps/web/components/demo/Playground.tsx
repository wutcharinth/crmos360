'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';

interface Message {
  direction: 'in' | 'out';
  body: string;
  pending?: boolean;
}

const STARTERS = [
  { label: 'ราคาเท่าไรคะ', vertical: 'commerce' },
  { label: 'รองรับ Shopee + TikTok ไหม', vertical: 'commerce' },
  { label: 'มี audit log ไหม', vertical: 'customer-ops' },
  { label: 'How does confidence-gating work?', vertical: 'customer-ops' },
  { label: 'PDPA + data residency?', vertical: 'services' },
];

/**
 * Interactive Gemini-backed playground. Hits the same /api/concierge endpoint
 * as the floating widget, but renders inline as part of the demo page so the
 * "scripted then interactive" pattern works.
 *
 * Limited to 6 turns per session to keep cost predictable.
 */
export function Playground() {
  const [messages, setMessages] = useState<Message[]>([
    {
      direction: 'out',
      body:
        'Try me. Ask anything about FlowAIOS. ตอบไทยหรือ English ก็ได้ค่ะ. Limited to 6 turns on this page; for unlimited, open the floating concierge.',
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [turnsUsed, setTurnsUsed] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const TURN_LIMIT = 6;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || sending || turnsUsed >= TURN_LIMIT) return;
    setSending(true);
    setMessages((m) => [
      ...m,
      { direction: 'in', body: text },
      { direction: 'out', body: '', pending: true },
    ]);
    setInput('');

    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((m) => {
        const next = [...m];
        for (let i = next.length - 1; i >= 0; i--) {
          const cur = next[i];
          if (cur && cur.direction === 'out' && cur.pending) {
            next[i] = {
              direction: 'out',
              body: data.reply ?? "Sorry, I couldn't reach the model just now. Try again?",
            };
            break;
          }
        }
        return next;
      });
      setTurnsUsed((n) => n + 1);
    } catch {
      setMessages((m) => {
        const next = [...m];
        for (let i = next.length - 1; i >= 0; i--) {
          const cur = next[i];
          if (cur && cur.direction === 'out' && cur.pending) {
            next[i] = { direction: 'out', body: 'Network hiccup. Please try again.' };
            break;
          }
        }
        return next;
      });
    } finally {
      setSending(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const limitReached = turnsUsed >= TURN_LIMIT;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="overflow-hidden rounded-2xl border border-hairline bg-paper">
        <header className="flex items-center justify-between border-b border-hairline bg-paper-2 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-mint opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            <p className="text-[13.5px] font-semibold text-ink">FlowAIOS Concierge</p>
            <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
              Live · Gemini 2.5 Flash
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
            Turns {turnsUsed}/{TURN_LIMIT}
          </span>
        </header>

        <div ref={scrollRef} className="h-[420px] space-y-3 overflow-y-auto px-5 py-4 text-[14px]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.direction === 'in' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-3.5 py-2.5 leading-relaxed ${
                  m.direction === 'in'
                    ? 'bg-warm text-paper'
                    : m.pending
                      ? 'bg-paper-2 text-mute italic'
                      : 'bg-paper-2 text-ink'
                }`}
              >
                {m.pending ? '…' : m.body}
              </div>
            </div>
          ))}
        </div>

        {limitReached ? (
          <div className="border-t border-hairline bg-warm-soft/50 px-5 py-3 text-[12.5px] text-warm">
            Session turn-limit reached on this page. Open the floating concierge (bottom-left) for an unlimited thread, or
            <a href="/signup" className="ml-1 underline hover:text-warm-2">
              start a free trial
            </a>
            .
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-hairline px-4 py-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
              placeholder="พิมพ์ข้อความ · type a message"
              className="flex-1 rounded-md border border-hairline bg-paper px-3 py-2 text-[14px] text-ink placeholder:text-mute focus:border-warm focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-md bg-warm px-3.5 py-2 text-[12.5px] font-medium text-paper transition-colors hover:bg-warm-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send
            </button>
          </form>
        )}
      </div>

      <aside>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          Try one of these
        </p>
        <ul className="mt-4 space-y-1.5">
          {STARTERS.map((s) => (
            <li key={s.label}>
              <button
                type="button"
                onClick={() => send(s.label)}
                disabled={sending || limitReached}
                className="group flex w-full items-baseline gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-paper-2 disabled:opacity-40"
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-mute group-hover:text-warm">
                  →
                </span>
                <div>
                  <p className="text-[13.5px] text-ink">{s.label}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
                    for · {s.vertical}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-9 rounded-xl border border-dashed border-hairline bg-paper-2/40 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            What you&rsquo;re seeing
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
            This is the same Gemini-backed concierge that ships on every FlowAIOS marketing
            page. The system prompt is tuned to FlowAIOS, refuses to reveal itself, and
            flags prompt-injection attempts to the admin /jailbreak feed.
          </p>
        </div>
      </aside>
    </div>
  );
}
