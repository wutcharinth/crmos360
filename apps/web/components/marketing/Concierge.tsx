'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';

interface Message {
  direction: 'in' | 'out';
  body: string;
  createdAt?: string;
  pending?: boolean;
}

const STARTERS_TH = [
  'ราคาเริ่มต้นเท่าไรคะ',
  'รองรับ LINE OA + Shopee + TikTok ไหม',
  'AI ตอบเองเมื่อไรบ้าง',
];

const STARTERS_EN = [
  'How does confidence-gated reply work?',
  'What channels do you support?',
  "What's the pricing?",
];

const THREAD_LS_KEY = 'flowaios-concierge-thread';

type Mode = 'chat' | 'contact-form' | 'contact-sent';

function looksThai(s: string): boolean {
  return /[ก-๙]/.test(s);
}

export function Concierge() {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<Mode>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [handed, setHanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const inputId = useId();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          direction: 'out',
          body:
            'สวัสดีค่ะ I\'m the FlowAIOS concierge. Ask me anything about pricing, channels, confidence-gated AI, or what ships in M1.5. ตอบไทยหรือ English ได้นะคะ. Tap "Contact team" if you want a human reply instead.',
        },
      ]);
      // Hydrate any prior thread for this visitor.
      fetch('/api/concierge', { method: 'GET' })
        .then((r) => r.json())
        .then((data: { threadId?: string; messages?: { direction: 'in' | 'out'; body: string; createdAt: string }[] }) => {
          if (Array.isArray(data?.messages) && data.messages.length > 0) {
            setMessages(
              data.messages.map((m) => ({
                direction: m.direction,
                body: m.body,
                createdAt: m.createdAt,
              })),
            );
            if (data.threadId) {
              try {
                localStorage.setItem(THREAD_LS_KEY, data.threadId);
              } catch {
                // ignore storage errors (private mode)
              }
            }
          }
        })
        .catch(() => {/* swallow */});
    }
  }, [open, messages.length]);

  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, open]);

  useEffect(() => {
    if (open && mode === 'chat' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, mode]);

  if (!hydrated) return null;

  const send = async (text: string) => {
    if (!text.trim() || sending) return;
    setSending(true);
    setError(null);
    setMessages((m) => [...m, { direction: 'in', body: text }, { direction: 'out', body: '', pending: true }]);
    setInput('');

    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail?.error ?? `concierge error ${res.status}`);
      }
      const data = (await res.json()) as {
        threadId: string;
        reply: string;
        status?: string;
        handoffRequested?: boolean;
      };

      try {
        localStorage.setItem(THREAD_LS_KEY, data.threadId);
      } catch {
        // ignore
      }

      setMessages((m) => {
        const next = [...m];
        for (let i = next.length - 1; i >= 0; i--) {
          const msg = next[i];
          if (msg && msg.direction === 'out' && msg.pending) {
            next[i] = { direction: 'out', body: data.reply };
            break;
          }
        }
        return next;
      });

      if (data.handoffRequested || data.status === 'handed_off') {
        setHanded(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown error';
      setError(msg);
      setMessages((m) => {
        const next = [...m];
        for (let i = next.length - 1; i >= 0; i--) {
          const cur = next[i];
          if (cur && cur.direction === 'out' && cur.pending) {
            next[i] = {
              direction: 'out',
              body: 'Sorry, the concierge had a hiccup. Please try again.',
            };
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

  const starters =
    messages.length <= 1 ? (looksThai(input) ? STARTERS_TH : STARTERS_EN) : [];

  return (
    <>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close concierge' : 'Open concierge'}
        className={`fixed bottom-6 left-6 z-30 inline-flex items-center gap-2 rounded-full border border-hairline bg-paper px-4 py-2.5 text-[13px] font-medium text-ink shadow-soft transition-all hover:-translate-y-0.5 hover:border-warm/40 ${
          open ? 'translate-y-1 opacity-0 pointer-events-none' : ''
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-warm opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-warm" />
        </span>
        Ask FlowAIOS
      </button>

      {/* Panel */}
      <div
        role="dialog"
        aria-label="FlowAIOS concierge"
        aria-hidden={!open}
        className={`fixed bottom-6 left-6 z-40 flex w-[min(380px,calc(100vw-32px))] flex-col rounded-2xl border border-hairline bg-paper shadow-terminal transition-all duration-200 ease-out ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
        style={{ maxHeight: 'calc(100vh - 48px)', height: open ? '600px' : 'auto' }}
      >
        {/* header */}
        <header className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-mint opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            <div>
              <p className="text-[13.5px] font-semibold text-ink">FlowAIOS Concierge</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
                {handed
                  ? 'handed off · team replying'
                  : 'Live · Gemini 2.5 Flash'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {mode === 'chat' && (
              <button
                type="button"
                onClick={() => setMode('contact-form')}
                className="rounded-md border border-hairline bg-paper-2 px-2.5 py-1.5 text-[11px] font-medium text-ink transition-colors hover:border-warm/40 hover:text-warm"
              >
                Contact team
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-md p-2 text-mute transition-colors hover:bg-paper-2 hover:text-ink"
            >
              <span aria-hidden>×</span>
            </button>
          </div>
        </header>

        {mode === 'chat' && (
          <ChatBody
            messages={messages}
            scrollRef={scrollRef}
            inputRef={inputRef}
            input={input}
            setInput={setInput}
            sending={sending}
            error={error}
            handed={handed}
            starters={starters}
            send={send}
            onSubmit={onSubmit}
            inputId={inputId}
            onContact={() => setMode('contact-form')}
          />
        )}

        {mode === 'contact-form' && (
          <ContactForm
            onCancel={() => setMode('chat')}
            onSent={() => {
              setHanded(true);
              setMode('contact-sent');
            }}
          />
        )}

        {mode === 'contact-sent' && (
          <div className="flex-1 space-y-4 px-6 py-9 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mint">
              Thanks · sent
            </p>
            <p className="text-[14px] leading-relaxed text-ink">
              The FlowAIOS team will reach out within 24 hours. You can keep chatting in
              the meantime.
            </p>
            <button
              type="button"
              onClick={() => setMode('chat')}
              className="rounded-md border border-hairline bg-paper-2 px-4 py-2 text-[12.5px] text-ink hover:border-warm/40 hover:text-warm"
            >
              Back to chat
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function ChatBody({
  messages,
  scrollRef,
  inputRef,
  input,
  setInput,
  sending,
  error,
  handed,
  starters,
  send,
  onSubmit,
  inputId,
  onContact,
}: {
  messages: Message[];
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  input: string;
  setInput: (v: string) => void;
  sending: boolean;
  error: string | null;
  handed: boolean;
  starters: string[];
  send: (text: string) => void;
  onSubmit: (e: FormEvent) => void;
  inputId: string;
  onContact: () => void;
}) {
  return (
    <>
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Concierge conversation"
        className="flex-1 space-y-3 overflow-y-auto px-5 py-4 text-[14px]"
      >
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
              {m.pending ? <PendingDots /> : m.body}
            </div>
          </div>
        ))}
      </div>

      {handed && (
        <div className="border-t border-hairline bg-mint-soft/60 px-5 py-2.5 text-[12px] text-mint">
          ทีมจะติดต่อกลับเร็วๆ นี้ค่ะ. The team will follow up soon.
        </div>
      )}

      {starters.length > 0 && !handed && (
        <div className="flex flex-wrap gap-1.5 border-t border-hairline px-5 pt-3">
          {starters.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              disabled={sending}
              className="rounded-full border border-hairline bg-paper-2 px-3 py-1.5 text-[12px] text-ink-2 transition-colors hover:border-warm/30 hover:bg-warm-soft hover:text-ink disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="border-t border-hairline bg-[hsl(var(--rose)/0.06)] px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-rose">
          {error}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="flex items-end gap-2 border-t border-hairline px-4 py-3"
      >
        <label htmlFor={inputId} className="sr-only">
          Message
        </label>
        <textarea
          ref={inputRef}
          id={inputId}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          disabled={sending}
          placeholder="พิมพ์ข้อความ · type a message"
          className="max-h-32 flex-1 resize-none rounded-md border border-hairline bg-paper px-3 py-2 text-[14px] text-ink placeholder:text-mute focus:border-warm focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="rounded-md bg-warm px-3.5 py-2 text-[12.5px] font-medium text-paper transition-colors hover:bg-warm-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </>
  );
}

function ContactForm({
  onCancel,
  onSent,
}: {
  onCancel: () => void;
  onSent: () => void;
}) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contact.trim() || submitting) return;
    setSubmitting(true);
    setErr(null);
    try {
      const res = await fetch('/api/concierge/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || undefined,
          contact: contact.trim(),
          message: message.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `error ${res.status}`);
      }
      onSent();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'failed to send');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
      <div>
        <p className="label-mono">Contact the team</p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
          Drop your email, LINE ID, or phone. We&rsquo;ll reach out within 24 hours.
          ทีมจะติดต่อกลับภายใน 24 ชม.ค่ะ
        </p>
      </div>

      <div className="space-y-3">
        <Field label="ชื่อ · Name (optional)" value={name} onChange={setName} />
        <Field
          label="อีเมล · LINE ID · เบอร์โทร"
          required
          placeholder="hi@you.co · @lineid · 081-234-5678"
          value={contact}
          onChange={setContact}
        />
        <Field
          label="ข้อความ · Message (optional)"
          textarea
          value={message}
          onChange={setMessage}
        />
      </div>

      {err && (
        <p className="font-mono text-[11px] uppercase tracking-widest text-rose">{err}</p>
      )}

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-[13px] text-mute hover:text-ink"
        >
          ← back
        </button>
        <button
          type="submit"
          disabled={submitting || !contact.trim()}
          className="rounded-md bg-warm px-4 py-2 text-[12.5px] font-medium text-paper transition-colors hover:bg-warm-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? 'Sending…' : 'Send'}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
        {label}
        {required && <span className="text-warm"> *</span>}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="mt-1.5 w-full resize-none rounded-md border border-hairline bg-paper px-3 py-2 text-[13.5px] text-ink placeholder:text-mute focus:border-warm focus:outline-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1.5 w-full rounded-md border border-hairline bg-paper px-3 py-2 text-[13.5px] text-ink placeholder:text-mute focus:border-warm focus:outline-none"
        />
      )}
    </label>
  );
}

function PendingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-mute" />
      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-mute [animation-delay:0.2s]" />
      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-mute [animation-delay:0.4s]" />
    </span>
  );
}
