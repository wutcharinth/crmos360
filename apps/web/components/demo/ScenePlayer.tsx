'use client';

import { useEffect, useRef, useState } from 'react';
import {
  SCENES,
  TOTAL_DURATION,
  type Scene,
  type SceneChannel,
} from '@/lib/demo/scenes';

const channelLabel: Record<SceneChannel, string> = {
  line: 'LINE OA',
  shopee: 'Shopee',
  tiktok: 'TikTok Shop',
  instagram: 'Instagram',
  lazada: 'Lazada',
  email: 'Email',
};

const channelChromeClass: Record<SceneChannel, string> = {
  line: 'border-mint/30 bg-mint-soft text-mint',
  shopee: 'border-warm/30 bg-warm-soft text-warm',
  tiktok: 'border-rose/30 bg-[hsl(var(--rose)/0.06)] text-rose',
  instagram: 'border-rose/30 bg-[hsl(var(--rose)/0.06)] text-rose',
  lazada: 'border-warm/30 bg-warm-soft text-warm',
  email: 'border-hairline bg-paper-2 text-mute',
};

const tierClass: Record<'auto' | 'approval' | 'escalate', string> = {
  auto: 'text-mint',
  approval: 'text-warm',
  escalate: 'text-rose',
};

interface PlayerState {
  sceneIndex: number;
  messageIndex: number; // -1 = scene starting, 0..n = message visible, n = scene finishing
  elapsed: number; // ms within current scene
  playing: boolean;
}

export function ScenePlayer() {
  const [state, setState] = useState<PlayerState>({
    sceneIndex: 0,
    messageIndex: -1,
    elapsed: 0,
    playing: true,
  });
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  useEffect(() => {
    if (!state.playing) return;
    const tick = (ts: number) => {
      if (!lastTickRef.current) lastTickRef.current = ts;
      const dt = ts - lastTickRef.current;
      lastTickRef.current = ts;

      setState((prev) => {
        if (!prev.playing) return prev;
        const scene = SCENES[prev.sceneIndex]!;
        let elapsed = prev.elapsed + dt;
        let sceneIndex = prev.sceneIndex;

        if (elapsed >= scene.duration) {
          elapsed = 0;
          sceneIndex = (sceneIndex + 1) % SCENES.length;
        }

        // Distribute messages across scene duration
        const nextScene = SCENES[sceneIndex]!;
        const perMsg = nextScene.duration / (nextScene.messages.length + 1);
        const messageIndex = Math.min(
          Math.floor(elapsed / perMsg) - 1,
          nextScene.messages.length - 1,
        );

        return { sceneIndex, messageIndex, elapsed, playing: prev.playing };
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTickRef.current = 0;
    };
  }, [state.playing]);

  const scene: Scene = SCENES[state.sceneIndex]!;
  const visibleMessages = scene.messages.slice(0, Math.max(0, state.messageIndex + 1));
  const lastAiMessage = [...visibleMessages].reverse().find((m) => m.from === 'ai');
  const sceneProgress = state.elapsed / scene.duration;
  const overallProgress = (() => {
    const before = SCENES.slice(0, state.sceneIndex).reduce((sum, s) => sum + s.duration, 0);
    return (before + state.elapsed) / TOTAL_DURATION;
  })();

  const togglePlay = () =>
    setState((prev) => ({ ...prev, playing: !prev.playing }));
  const jumpToScene = (idx: number) =>
    setState({ sceneIndex: idx, messageIndex: -1, elapsed: 0, playing: state.playing });
  const resetPlayer = () => {
    lastTickRef.current = 0;
    setState({ sceneIndex: 0, messageIndex: -1, elapsed: 0, playing: true });
  };

  return (
    <div className="grid gap-7 lg:grid-cols-[260px_1fr_320px]">
      {/* Scene rail */}
      <aside>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          Scenes · 0:30 walkthrough
        </p>
        <ol className="mt-4 space-y-1.5">
          {SCENES.map((s, i) => {
            const active = i === state.sceneIndex;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => jumpToScene(i)}
                  className={`group flex w-full items-baseline gap-3 rounded-md px-2 py-2 text-left transition-colors ${
                    active ? 'bg-warm-soft' : 'hover:bg-paper-2'
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] tabular-nums ${
                      active ? 'text-warm' : 'text-mute'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-[12.5px] leading-snug ${
                      active ? 'text-ink' : 'text-ink-2'
                    }`}
                  >
                    {s.caption}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-7 flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={state.playing ? 'Pause' : 'Play'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-paper transition-colors hover:border-warm hover:text-warm"
          >
            {state.playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            type="button"
            onClick={resetPlayer}
            aria-label="Replay"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-paper transition-colors hover:border-warm hover:text-warm"
          >
            <ReplayIcon />
          </button>
          <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
            {Math.round(overallProgress * 100)}%
          </span>
        </div>
        <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-hairline">
          <div
            className="h-full bg-warm transition-all duration-75 ease-linear"
            style={{ width: `${overallProgress * 100}%` }}
          />
        </div>
      </aside>

      {/* Phone-style transcript */}
      <div>
        <div className="overflow-hidden rounded-[28px] border border-hairline bg-paper-2 p-2 shadow-terminal">
          <div className="overflow-hidden rounded-[22px] bg-paper">
            {/* Phone bar */}
            <div className="flex items-center justify-between border-b border-hairline bg-paper-2 px-4 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                {scene.customer.handle ?? channelLabel[scene.channel]}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${channelChromeClass[scene.channel]}`}
              >
                {channelLabel[scene.channel]}
              </span>
            </div>
            <div className="min-h-[420px] space-y-2 px-4 py-4">
              {visibleMessages.map((m, i) => (
                <div
                  key={`${state.sceneIndex}-${i}`}
                  className={`flex animate-[fadeIn_0.32s_ease-out] ${
                    m.from === 'customer' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      m.from === 'customer'
                        ? 'bg-paper-2 text-ink'
                        : m.from === 'ai'
                          ? 'bg-warm text-paper'
                          : 'bg-mint-soft text-mint'
                    }`}
                  >
                    {m.from === 'agent' && (
                      <p className="mb-1 font-mono text-[9px] uppercase tracking-widest opacity-80">
                        Agent · human
                      </p>
                    )}
                    {m.body}
                  </div>
                </div>
              ))}
              {/* Typing indicator near end of customer turns */}
              {state.messageIndex >= 0 &&
                state.messageIndex < scene.messages.length - 1 && (
                  <div className="flex justify-start">
                    <span className="inline-flex items-center gap-1 rounded-2xl bg-paper-2 px-3 py-2 text-mute">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mute" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mute [animation-delay:0.15s]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mute [animation-delay:0.3s]" />
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>
        <p className="mt-4 max-w-[42ch] text-[13px] italic text-ink-2">
          {scene.caption}
        </p>
      </div>

      {/* Bot trace panel */}
      <aside>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          Bot trace · live
        </p>
        {lastAiMessage?.trace ? (
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-baseline gap-3">
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.14em] ${tierClass[lastAiMessage.trace.tier]}`}
                >
                  {lastAiMessage.trace.tier}
                </span>
                <span className="text-[24px] font-semibold tabular-nums text-ink">
                  {Math.round(lastAiMessage.trace.confidence * 100)}%
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                  confidence
                </span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-paper-3">
                <div
                  className={`h-full transition-all duration-300 ${
                    lastAiMessage.trace.tier === 'auto'
                      ? 'bg-mint'
                      : lastAiMessage.trace.tier === 'approval'
                        ? 'bg-warm'
                        : 'bg-rose'
                  }`}
                  style={{ width: `${lastAiMessage.trace.confidence * 100}%` }}
                />
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
                Reasoning
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
                {lastAiMessage.trace.reasoning}
              </p>
            </div>

            {lastAiMessage.trace.sources && lastAiMessage.trace.sources.length > 0 && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
                  Sources
                </p>
                <ul className="mt-1.5 space-y-1.5">
                  {lastAiMessage.trace.sources.map((src) => (
                    <li
                      key={src}
                      className="flex gap-2 font-mono text-[11px] text-ink-2"
                    >
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-warm" />
                      {src}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-4 text-[12.5px] text-mute">
            Waiting for AI to reply…
          </p>
        )}
      </aside>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M3 1.5v9l7-4.5z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <rect x="2.5" y="1.5" width="2.5" height="9" />
      <rect x="7" y="1.5" width="2.5" height="9" />
    </svg>
  );
}
function ReplayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M11 6.5a4.5 4.5 0 1 1-1.32-3.18" />
      <path d="M11 1v3h-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
