'use client';

import { useEffect, useState } from 'react';
import {
  VERTICAL_COOKIE,
  verticalProfiles,
  type Vertical,
} from '@/lib/marketing/vertical';

function readCookie(): Vertical | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${VERTICAL_COOKIE}=([^;]*)`));
  const v = m?.[1];
  if (!v) return null;
  return verticalProfiles.some((p) => p.id === v) ? (v as Vertical) : null;
}

function writeCookie(v: Vertical) {
  if (typeof document === 'undefined') return;
  document.cookie = `${VERTICAL_COOKIE}=${v}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function VerticalChooser({ initialVertical }: { initialVertical?: Vertical | null }) {
  // Server passes initialVertical from cookie. Client mirrors + manages state.
  const [vertical, setVertical] = useState<Vertical | null>(initialVertical ?? null);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // On hydrate, re-read cookie (in case server got stale value or none).
    setHydrated(true);
    const fromCookie = readCookie();
    if (fromCookie !== vertical) setVertical(fromCookie);
    // First-visit overlay: if no cookie, show after a short delay so the page settles.
    if (!fromCookie) {
      const timer = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (v: Vertical) => {
    writeCookie(v);
    setVertical(v);
    setOpen(false);
  };

  if (!hydrated) return null;

  return (
    <>
      {/* Persistent chip — shows what was chosen, click to change */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full border border-hairline bg-paper px-4 py-2.5 text-[12px] font-medium text-ink-2 shadow-soft backdrop-blur transition-colors hover:bg-paper-2 hover:text-ink"
        aria-label="Choose your business type"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
          For
        </span>
        <span>
          {vertical
            ? verticalProfiles.find((p) => p.id === vertical)?.label
            : 'Choose your business →'}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="vertical-chooser-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 px-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && vertical) setOpen(false);
          }}
        >
          <div className="w-full max-w-2xl rounded-2xl border border-hairline bg-paper p-8 shadow-terminal">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="label-mono">Personalize</p>
                <h2 id="vertical-chooser-title" className="display-md mt-2">
                  ธุรกิจของคุณคล้ายแบบไหนมากที่สุด
                </h2>
                <p className="lead mt-3">
                  เลือกตอบเพื่อให้ FlowAIOS แสดง channel + use case ที่เกี่ยวกับคุณ
                  ไม่ต้องเลือกตอนนี้ก็ได้ — กลับมาเปลี่ยนได้ตลอด
                </p>
              </div>
              {vertical && (
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="rounded-md p-2 text-mute transition-colors hover:bg-paper-2 hover:text-ink"
                >
                  <span aria-hidden>×</span>
                </button>
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {verticalProfiles.map((p) => {
                const active = p.id === vertical;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => choose(p.id)}
                    className={`group flex flex-col gap-2 rounded-xl border p-4 text-left transition-all ${
                      active
                        ? 'border-warm bg-warm-soft'
                        : 'border-hairline bg-paper-2 hover:-translate-y-0.5 hover:border-hairline-2 hover:bg-paper'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[14px] font-semibold text-ink">{p.label}</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                        {p.id}
                      </span>
                    </div>
                    <p className="text-[12.5px] leading-snug text-ink-2">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.channels.map((c) => (
                        <span
                          key={c}
                          className="rounded-full bg-paper px-2 py-0.5 font-mono text-[10px] text-ink-2"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-mute">
              คุกกี้นี้เก็บการเลือก · ไม่ส่งข้อมูลออกจาก browser
            </p>
          </div>
        </div>
      )}
    </>
  );
}
