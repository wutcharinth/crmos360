'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface MessageItem {
  id: string;
  direction: 'inbound' | 'outbound';
  body: string;
  aiGenerated: boolean;
  sentAt: string;
}

interface Props {
  conversationId: string;
  autoReplyEnabled: boolean;
  status: string;
  messages: MessageItem[];
}

export function ThreadView({ conversationId, autoReplyEnabled, status, messages }: Props) {
  const [draft, setDraft] = useState('');
  const [autoReply, setAutoReply] = useState(autoReplyEnabled);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [suggesting, setSuggesting] = useState(false);
  const router = useRouter();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    const id = setInterval(() => {
      router.refresh();
    }, 12000);
    return () => clearInterval(id);
  }, [router]);

  async function send() {
    if (!draft.trim() || pending) return;
    setError(null);
    const body = draft.trim();
    setDraft('');
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
      }
    });
  }

  async function patchConvo(patch: Record<string, unknown>, optimistic: () => void) {
    optimistic();
    setError(null);
    try {
      const res = await fetch(`/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `${res.status}`);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    }
  }

  async function suggest() {
    if (suggesting) return;
    setSuggesting(true);
    setError(null);
    try {
      const res = await fetch(`/api/conversations/${conversationId}/suggest`, {
        method: 'POST',
      });
      const data = (await res.json()) as { text?: string; error?: string; message?: string };
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? `${res.status}`);
      }
      if (data.text) setDraft(data.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Suggestion failed');
    } finally {
      setSuggesting(false);
    }
  }

  const STATUSES = ['open', 'pending', 'resolved', 'closed'];

  return (
    <div className="flex h-[calc(100vh-260px)] min-h-[400px] flex-col rounded-lg border bg-background">
      <div className="flex items-center justify-between border-b px-4 py-2 text-sm">
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={autoReply}
              onChange={(e) =>
                patchConvo({ auto_reply_enabled: e.target.checked }, () =>
                  setAutoReply(e.target.checked),
                )
              }
              className="h-4 w-4"
            />
            <span>Auto-reply</span>
          </label>
        </div>
        <select
          value={currentStatus}
          onChange={(e) =>
            patchConvo({ status: e.target.value }, () => setCurrentStatus(e.target.value))
          }
          className="rounded-md border bg-background px-2 py-1 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  m.direction === 'outbound'
                    ? 'bg-warm text-paper'
                    : 'bg-paper-2 text-foreground'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
                <div className="mt-1 flex items-center gap-2 text-[10px] opacity-60">
                  <time>
                    {new Date(m.sentAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                  {m.aiGenerated && (
                    <span className="rounded bg-paper/30 px-1 font-mono">AI</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t p-3">
        {error && (
          <p className="mb-2 text-xs text-destructive">{error}</p>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Type your reply… (⌘+Enter to send)"
            rows={2}
            className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-warm/30"
          />
          <div className="flex flex-col gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={suggest}
              disabled={suggesting}
              title="Generate AI suggestion"
            >
              {suggesting ? '…' : '✨ AI'}
            </Button>
            <Button onClick={send} disabled={pending || !draft.trim()} size="sm">
              {pending ? 'Sending…' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
