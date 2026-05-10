'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { SCENARIOS, type ScenarioId } from '@/lib/demo/scenarios';
import { ChatBody } from '@/components/ui/chat-body';
import { CategoryIcon } from './CategoryIcon';

/**
 * Interactive demo with 5 ecommerce scenarios, each highlighting a
 * distinct AI capability. User picks a category tab; the chat boots
 * with the brand's greeting + 3 starter prompts. Replies hit
 * /api/demo/scenario which loads the per-scenario system prompt
 * server-side (brand catalog, policies, special-behavior rules).
 *
 * Per-scenario turn limit (4 turns each) keeps cost predictable;
 * switching tabs resets the conversation but not the global limit.
 */
interface Message {
  role: 'user' | 'assistant';
  content: string;
  pending?: boolean;
  failed?: boolean;
  /** Echoes the user message that produced this assistant reply so retry can resend. */
  retrySource?: string;
}

const TURNS_PER_SCENARIO = 6;

export function ScenarioPlayground({ initialLang = 'th' }: { initialLang?: 'th' | 'en' }) {
  const [activeId, setActiveId] = useState<ScenarioId>(SCENARIOS[0]!.id);
  const [lang, setLang] = useState<'th' | 'en'>(initialLang);
  const [messagesByScenario, setMessagesByScenario] = useState<
    Record<ScenarioId, Message[]>
  >(() =>
    Object.fromEntries(
      SCENARIOS.map((s) => [s.id, [{ role: 'assistant', content: s.greeting[initialLang] }]]),
    ) as Record<ScenarioId, Message[]>,
  );
  const [turnsByScenario, setTurnsByScenario] = useState<Record<ScenarioId, number>>(
    () => Object.fromEntries(SCENARIOS.map((s) => [s.id, 0])) as Record<ScenarioId, number>,
  );
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Mirror the user's lang cookie if it changes (toggling TH/EN in nav).
  useEffect(() => {
    const read = () => {
      const m = document.cookie.match(/(?:^|; )flowaios-lang=([^;]*)/);
      const v = m?.[1];
      setLang(v === 'en' ? 'en' : 'th');
    };
    read();
    const id = window.setInterval(read, 1500);
    return () => window.clearInterval(id);
  }, []);

  const active = SCENARIOS.find((s) => s.id === activeId)!;
  const messages = messagesByScenario[activeId] ?? [];
  const turns = turnsByScenario[activeId] ?? 0;
  const limitReached = turns >= TURNS_PER_SCENARIO;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages.length, activeId]);

  // When a user switches tabs, if the chat for that tab still has only
  // the greeting, re-seed it with the current language version so the
  // intro line follows the user's TH/EN preference.
  useEffect(() => {
    setMessagesByScenario((prev) => {
      const next = { ...prev };
      for (const s of SCENARIOS) {
        const existing = next[s.id] ?? [];
        if (existing.length === 1 && existing[0]?.role === 'assistant') {
          next[s.id] = [{ role: 'assistant', content: s.greeting[lang] }];
        }
      }
      return next;
    });
  }, [lang]);

  const send = async (text: string) => {
    if (!text.trim() || sending || limitReached) return;
    setSending(true);

    const historyForApi = messages
      .filter((m) => !m.pending)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessagesByScenario((prev) => ({
      ...prev,
      [activeId]: [
        ...(prev[activeId] ?? []),
        { role: 'user', content: text },
        { role: 'assistant', content: '', pending: true },
      ],
    }));
    setInput('');

    try {
      const res = await fetch('/api/demo/scenario', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          scenarioId: activeId,
          message: text,
          history: historyForApi,
        }),
      });
      const data = (await res.json()) as {
        reply?: string;
        finishReason?: string;
        rateLimited?: boolean;
        reason?: string;
      };
      const reply = (data.reply ?? '').trim();
      const ok = res.ok && reply.length > 0;
      setMessagesByScenario((prev) => {
        const list = [...(prev[activeId] ?? [])];
        for (let i = list.length - 1; i >= 0; i--) {
          if (list[i]?.pending) {
            list[i] = ok
              ? { role: 'assistant', content: reply }
              : {
                  role: 'assistant',
                  content:
                    reply ||
                    (data.rateLimited
                      ? lang === 'th'
                        ? 'แตะเบรกชั่วคราว ลองอีกครั้งใน 1-2 นาทีนะคะ'
                        : 'Brief pause — try again in a minute.'
                      : lang === 'th'
                        ? 'ระบบขัดข้อง ลองอีกครั้งนะคะ'
                        : 'Hit a snag. Tap retry below.'),
                  failed: true,
                  retrySource: text,
                };
            break;
          }
        }
        return { ...prev, [activeId]: list };
      });
      if (ok) {
        setTurnsByScenario((prev) => ({ ...prev, [activeId]: (prev[activeId] ?? 0) + 1 }));
      }
    } catch {
      setMessagesByScenario((prev) => {
        const list = [...(prev[activeId] ?? [])];
        for (let i = list.length - 1; i >= 0; i--) {
          if (list[i]?.pending) {
            list[i] = {
              role: 'assistant',
              content:
                lang === 'th'
                  ? 'เครือข่ายขัดข้อง ลองอีกครั้งนะคะ'
                  : 'Network hiccup — tap retry below.',
              failed: true,
              retrySource: text,
            };
            break;
          }
        }
        return { ...prev, [activeId]: list };
      });
    } finally {
      setSending(false);
    }
  };

  const retry = (text: string) => {
    setMessagesByScenario((prev) => {
      const list = (prev[activeId] ?? []).filter(
        (m, idx, arr) =>
          // drop the failed assistant + the user message that produced it
          !(m.failed && arr[idx - 1]?.role === 'user' && arr[idx - 1]?.content === text) &&
          !(m.role === 'user' && m.content === text && arr[idx + 1]?.failed),
      );
      return { ...prev, [activeId]: list };
    });
    void send(text);
  };

  const reset = () => {
    setMessagesByScenario((prev) => ({
      ...prev,
      [activeId]: [{ role: 'assistant', content: active.greeting[lang] }],
    }));
    setTurnsByScenario((prev) => ({ ...prev, [activeId]: 0 }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="rounded-2xl border border-hairline bg-paper">
      {/* Scenario tabs */}
      <div
        className="flex shrink-0 gap-1 overflow-x-auto border-b border-hairline px-3 py-3 sm:gap-1.5"
        role="tablist"
      >
        {SCENARIOS.map((s) => {
          const on = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActiveId(s.id)}
              className={`shrink-0 rounded-lg px-3 py-2 text-left transition-colors ${
                on
                  ? 'bg-warm-soft text-warm'
                  : 'text-ink-2 hover:bg-paper-2 hover:text-ink'
              }`}
            >
              <div className="flex items-center gap-2">
                <CategoryIcon name={s.icon} size={16} />
                <span className="text-[12.5px] font-medium">
                  {lang === 'th' ? s.category.th : s.category.en}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
        {/* Chat panel */}
        <div className="flex flex-col">
          {/* Brand header */}
          <header className="flex items-center justify-between gap-3 border-b border-hairline bg-paper-2 px-5 py-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-[14px] font-semibold text-ink">
                <CategoryIcon name={active.icon} size={16} className="text-warm" />
                {active.brand}
              </p>
              <p className="truncate text-[12px] text-mute">
                {lang === 'th' ? active.tagline.th : active.tagline.en}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[10px] uppercase tracking-widest text-mute"
                title={
                  lang === 'th'
                    ? `ใช้ไป ${turns} จาก ${TURNS_PER_SCENARIO} เทิร์น (ป้องกันค่าใช้จ่าย AI)`
                    : `Used ${turns} of ${TURNS_PER_SCENARIO} turns (cost guard)`
                }
              >
                {lang === 'th' ? 'เทิร์น' : 'turn'} {turns}/{TURNS_PER_SCENARIO}
              </span>
              {turns > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-md border border-hairline bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-mute transition-colors hover:border-warm hover:text-warm"
                  title={lang === 'th' ? 'เริ่มใหม่' : 'Reset chat'}
                >
                  {lang === 'th' ? 'เริ่มใหม่' : 'reset'}
                </button>
              )}
            </div>
          </header>

          {/* Capability callout */}
          <div className="border-b border-hairline bg-warm-soft/40 px-5 py-2.5">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-warm">
              AI capability
            </p>
            <p className="mt-0.5 text-[12.5px] leading-snug text-ink-2">
              {lang === 'th' ? active.capability.th : active.capability.en}
            </p>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="h-[420px] space-y-3 overflow-y-auto px-5 py-4 text-[14px]"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    m.role === 'user'
                      ? 'rounded-br-sm bg-warm text-paper'
                      : m.pending
                        ? 'rounded-bl-sm bg-paper-2 text-mute italic'
                        : m.failed
                          ? 'rounded-bl-sm border border-rose/30 bg-[hsl(var(--rose)/0.06)] text-ink'
                          : 'rounded-bl-sm bg-paper-2 text-ink'
                  }`}
                >
                  {m.pending ? (
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mute" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mute [animation-delay:0.15s]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mute [animation-delay:0.3s]" />
                    </span>
                  ) : (
                    <>
                      <ChatBody text={m.content} />
                      {m.failed && m.retrySource && (
                        <button
                          type="button"
                          onClick={() => retry(m.retrySource!)}
                          disabled={sending}
                          className="ml-2 mt-2 inline-block rounded-md border border-rose/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-rose transition-colors hover:bg-rose/10 disabled:opacity-40"
                        >
                          {lang === 'th' ? 'ลองใหม่' : 'retry'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          {limitReached ? (
            <div className="border-t border-hairline bg-warm-soft/50 px-5 py-3 text-[12.5px] text-warm">
              Turn limit reached for this scenario. Try a different category tab, or
              <a href="/signup" className="ml-1 underline hover:text-warm-2">
                start a free trial
              </a>
              .
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="flex items-end gap-2 border-t border-hairline px-4 py-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={sending}
                placeholder={
                  lang === 'th'
                    ? 'พิมพ์คำถามถึงร้าน · type a question'
                    : 'Type a question to the store...'
                }
                className="flex-1 rounded-md border border-hairline bg-paper px-3 py-2 text-[16px] text-ink placeholder:text-mute focus:border-warm focus:outline-none sm:text-[14px]"
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

        {/* Side rail with starters */}
        <aside className="border-t border-hairline lg:border-l lg:border-t-0 lg:bg-paper-2/30">
          <p className="px-5 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Try a question
          </p>
          <ul className="mt-2 px-2 pb-4">
            {active.starters.map((s, i) => {
              const text = lang === 'th' ? s.th : s.en;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => send(text)}
                    disabled={sending || limitReached}
                    className="group flex w-full items-baseline gap-2 rounded-md px-3 py-2 text-left text-[13px] leading-snug text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink disabled:opacity-40"
                  >
                    <span
                      aria-hidden
                      className="font-mono text-[10px] text-mute group-hover:text-warm"
                    >
                      →
                    </span>
                    <span>{text}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mx-3 mb-4 rounded-lg border border-dashed border-hairline bg-paper-2/40 p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              {lang === 'th' ? 'ทำไมแต่ละหมวดต่างกัน' : 'Why each category differs'}
            </p>
            <p className="mt-1.5 text-[12px] leading-snug text-ink-2">
              {lang === 'th'
                ? 'แต่ละ tab มี catalog, policy, และกฎ "ตอบไม่ได้" ของตัวเอง — AI ใช้ system prompt ของ tab นั้นๆ ในการตอบลูกค้า'
                : "Each tab loads its own catalog, policies, and 'do-not-answer' rules. The AI uses that tab's system prompt to reply as that store's agent."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
