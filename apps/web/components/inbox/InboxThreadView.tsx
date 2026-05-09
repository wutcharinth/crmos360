'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChannelIcon, type ChannelKey } from '@/components/ui/channel-icon';

/**
 * Right-of-list column — the conversation thread.
 *
 * Top → bottom:
 *   1. Thread head: avatar (with channel sub-badge), name, customer meta
 *      strip (tier · orders · LTV · confidence), action icons.
 *   2. Body: alternating bubbles. Inbound = light, outbound = ink-on-paper,
 *      AI-sent = warm gradient (signals "this was AI-generated and approved").
 *   3. Inline AI draft panel: appears when an AI draft is loaded but not
 *      yet sent. Shows draft text, confidence pill, reasoning bullets,
 *      Approve / Edit / Regenerate actions.
 *   4. Composer: mode switcher (Auto / Approval / Escalate), toolbar,
 *      textarea, Send button. Tab inserts the AI draft, ⌘+Enter sends.
 *
 * What's wired vs mocked:
 *   - Messages, customer name, channel, auto-reply flag → real Supabase
 *   - Send to channel → POST /api/conversations/[id]/reply (existing)
 *   - AI draft → POST /api/conversations/[id]/suggest (existing, button-triggered)
 *   - Mode switcher → local state (UI only; backend gate to come)
 *   - Confidence / customer tier / orders / LTV → display from props
 *     when present, otherwise hidden
 */
interface MessageItem {
  id: string;
  direction: 'inbound' | 'outbound';
  body: string;
  aiGenerated: boolean;
  sentAt: string;
}

interface ThreadProps {
  conversationId: string;
  customerName: string | null;
  channel: ChannelKey;
  status: string;
  autoReplyEnabled: boolean;
  messages: MessageItem[];
  customerMeta?: {
    tier?: string;
    orders?: number;
    ltv?: string | null;
    confidence?: number | null;
  };
}

type Mode = 'auto' | 'approve' | 'escalate';

export function InboxThreadView({
  conversationId,
  customerName,
  channel,
  status,
  autoReplyEnabled,
  messages,
  customerMeta,
}: ThreadProps) {
  const router = useRouter();
  const bodyRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState('');
  const [mode, setMode] = useState<Mode>(
    autoReplyEnabled ? 'auto' : status === 'pending' ? 'escalate' : 'approve',
  );
  const [aiDraft, setAiDraft] = useState<{ text: string; confidence?: number } | null>(null);
  const [draftAccepted, setDraftAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // scroll to bottom on new message
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages.length]);

  // poll for new messages every 12s (matches old behavior)
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 12000);
    return () => clearInterval(id);
  }, [router]);

  async function fetchAiDraft() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/conversations/${conversationId}/suggest`, {
        method: 'POST',
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `${res.status}`);
      }
      const data = (await res.json()) as { suggestion?: string; confidence?: number };
      if (data.suggestion) {
        setAiDraft({ text: data.suggestion, confidence: data.confidence });
        setDraftAccepted(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch AI draft');
    } finally {
      setBusy(false);
    }
  }

  async function send(text: string) {
    const body = text.trim();
    if (!body || pending) return;
    setError(null);
    setDraft('');
    setDraftAccepted(true);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/conversations/${conversationId}/reply`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ body }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(data.error ?? `${res.status}`);
        }
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to send');
        setDraft(body);
        setDraftAccepted(false);
      }
    });
  }

  const showAiPanel = aiDraft && !draftAccepted;

  return (
    <>
      {/* head */}
      <header className="flex shrink-0 items-center gap-3 border-b border-hairline bg-paper px-6 py-3.5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-paper-2 text-[13px] font-semibold text-ink-2">
          {initials(customerName ?? '?')}
          <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 overflow-hidden rounded-[5px] ring-2 ring-paper">
            <ChannelIcon channel={channel} size={16} />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-ink">
            {customerName ?? 'Unnamed customer'}
          </h3>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-mute">
            {customerMeta?.tier && <span>{customerMeta.tier}</span>}
            {customerMeta?.orders != null && (
              <>
                <span>·</span>
                <span>{customerMeta.orders} orders</span>
              </>
            )}
            {customerMeta?.ltv && (
              <>
                <span>·</span>
                <span>LTV {customerMeta.ltv}</span>
              </>
            )}
            {customerMeta?.confidence != null && (
              <>
                <span>·</span>
                <span
                  className={`font-mono ${confColor(customerMeta.confidence)}`}
                >
                  conf {customerMeta.confidence}%
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <IconButton title="Search" path="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z" />
          <IconButton title="More" path="M19 12a1 1 0 100-2 1 1 0 000 2zM12 12a1 1 0 100-2 1 1 0 000 2zM5 12a1 1 0 100-2 1 1 0 000 2z" />
        </div>
      </header>

      {/* body */}
      <div
        ref={bodyRef}
        className="flex-1 space-y-3 overflow-y-auto px-7 py-6"
        style={{
          background:
            'radial-gradient(800px 400px at 80% 0%, hsl(var(--warm) / 0.04), transparent 70%)',
        }}
      >
        <div className="mx-auto w-fit rounded-full border border-hairline bg-paper px-2.5 py-1 font-mono text-[10px] text-mute">
          Today
        </div>
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-mute">No messages in this thread yet.</p>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} msg={m} />
        ))}

        {showAiPanel && aiDraft && (
          <AiDraftPanel
            draft={aiDraft.text}
            confidence={aiDraft.confidence}
            mode={mode}
            busy={busy}
            onApprove={() => send(aiDraft.text)}
            onEdit={() => {
              setDraft(aiDraft.text);
              textareaRef.current?.focus();
            }}
            onRegenerate={fetchAiDraft}
          />
        )}
      </div>

      {/* composer */}
      <div className="shrink-0 border-t border-hairline bg-paper px-6 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {(['auto', 'approve', 'escalate'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wide transition-colors ${modePillClass(m, mode)}`}
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
              {modeLabel(m)}
            </button>
          ))}
          <span className="ml-auto flex gap-2 font-mono text-[10px] text-mute">
            <span>Tab · accept draft</span>
            <span>⌘↵ · send</span>
          </span>
        </div>
        <div className="flex items-end gap-2 rounded-xl border border-hairline bg-paper p-3 transition focus-within:border-warm focus-within:shadow-[0_0_0_3px_hsl(var(--warm)/0.12)]">
          <div className="flex flex-col gap-0.5 pb-0.5">
            <ToolbarButton
              title="Attach"
              path="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
            />
            <ToolbarButton
              title="AI draft"
              onClick={fetchAiDraft}
              disabled={busy}
              path="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"
            />
          </div>
          <textarea
            ref={textareaRef}
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Tab' && !draft && aiDraft) {
                e.preventDefault();
                setDraft(aiDraft.text);
              }
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                send(draft);
              }
            }}
            placeholder={mode === 'escalate' ? 'พิมพ์ note หรือ assign…' : 'พิมพ์ข้อความ ·  Tab to accept AI draft'}
            className="max-h-32 min-h-[36px] flex-1 resize-none bg-transparent text-[16px] leading-relaxed text-ink placeholder:text-mute focus:outline-none sm:text-[14px]"
          />
          <button
            type="button"
            onClick={() => send(draft)}
            disabled={!draft.trim() || pending}
            className="inline-flex items-center gap-1.5 rounded-md bg-ink px-3.5 py-2 text-[12.5px] font-medium text-paper transition-colors hover:bg-ink/90 disabled:bg-paper-3 disabled:text-mute"
          >
            {sendLabel(mode)} <span aria-hidden>↵</span>
          </button>
        </div>
        {error && (
          <p className="mt-2 font-mono text-[10.5px] uppercase tracking-wide text-rose">{error}</p>
        )}
      </div>
    </>
  );
}

function MessageBubble({ msg }: { msg: MessageItem }) {
  const time = new Date(msg.sentAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  if (msg.direction === 'inbound') {
    return (
      <div className="flex">
        <div className="max-w-[70%] rounded-2xl rounded-bl-sm border border-hairline bg-paper px-3.5 py-2.5 text-[14px] leading-relaxed text-ink">
          <div className="whitespace-pre-wrap">{msg.body}</div>
          <div className="mt-1.5 font-mono text-[10px] text-mute">{time}</div>
        </div>
      </div>
    );
  }
  // outbound
  return (
    <div className="flex justify-end">
      <div
        className={`max-w-[70%] rounded-2xl rounded-br-sm px-3.5 py-2.5 text-[14px] leading-relaxed text-paper ${
          msg.aiGenerated
            ? 'bg-gradient-to-br from-warm to-warm-2'
            : 'bg-ink'
        }`}
      >
        <div className="whitespace-pre-wrap">{msg.body}</div>
        <div className="mt-1.5 flex items-center gap-2 font-mono text-[10px] text-paper/70">
          <span>{time}</span>
          {msg.aiGenerated && (
            <span className="rounded-full bg-paper/15 px-1.5 py-0.5">AI sent</span>
          )}
        </div>
      </div>
    </div>
  );
}

function AiDraftPanel({
  draft,
  confidence,
  mode,
  busy,
  onApprove,
  onEdit,
  onRegenerate,
}: {
  draft: string;
  confidence?: number;
  mode: Mode;
  busy: boolean;
  onApprove: () => void;
  onEdit: () => void;
  onRegenerate: () => void;
}) {
  return (
    <div className="self-stretch rounded-2xl border border-warm/25 bg-gradient-to-b from-warm-soft to-paper p-4">
      <div className="mb-2.5 flex items-center gap-2 text-[12px] text-warm">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-warm font-mono text-[10px] font-bold text-paper">
          F
        </span>
        <span className="font-medium">AI suggested reply</span>
        {confidence != null && (
          <span className="ml-auto rounded-full border border-warm/20 bg-paper px-2 py-0.5 font-mono text-[10.5px]">
            {confidence}%
          </span>
        )}
      </div>
      <div className="rounded-lg border border-hairline bg-paper px-3 py-2.5 text-[13.5px] leading-relaxed text-ink">
        {busy ? <span className="text-mute">…</span> : <span className="whitespace-pre-wrap">{draft}</span>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onApprove}
          disabled={busy || !draft}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
            mode === 'escalate'
              ? 'bg-rose text-paper hover:bg-rose/90'
              : 'bg-warm text-paper hover:bg-warm-2'
          }`}
        >
          {mode === 'escalate' ? 'Escalate →' : 'Approve & send →'}
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-md border border-hairline bg-paper px-3 py-1.5 text-[12.5px] text-ink-2 hover:border-hairline-2 hover:text-ink"
        >
          Edit before sending
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] text-ink-2 hover:bg-paper-2 disabled:opacity-50"
        >
          <SparkleIcon /> Regenerate
        </button>
      </div>
    </div>
  );
}

function IconButton({ title, path }: { title: string; path: string }) {
  return (
    <button
      type="button"
      title={title}
      className="rounded-md p-1.5 text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
    >
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={path} />
      </svg>
    </button>
  );
}

function ToolbarButton({
  title,
  path,
  onClick,
  disabled,
}: {
  title: string;
  path: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="rounded-md p-1.5 text-mute transition-colors hover:bg-paper-2 hover:text-ink disabled:opacity-50"
    >
      <svg
        width={15}
        height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={path} />
      </svg>
    </button>
  );
}

function SparkleIcon() {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    </svg>
  );
}

function initials(s: string) {
  return s
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function confColor(c: number) {
  if (c >= 90) return 'text-mint';
  if (c >= 70) return 'text-warm';
  return 'text-rose';
}

function modeLabel(m: Mode) {
  return m === 'auto' ? 'Auto · 90%+' : m === 'approve' ? 'Approval · 70-90%' : 'Escalate · <70%';
}

function modePillClass(m: Mode, active: Mode) {
  if (m !== active) {
    return 'border-hairline bg-paper-2 text-ink-2 hover:bg-paper-3';
  }
  if (m === 'auto') return 'border-mint/30 bg-mint-soft text-mint';
  if (m === 'approve') return 'border-warm/30 bg-warm-soft text-warm';
  return 'border-rose/30 bg-[hsl(var(--rose)/0.08)] text-rose';
}

function sendLabel(m: Mode) {
  return m === 'approve' ? 'Send for approval' : m === 'escalate' ? 'Escalate' : 'Send';
}
