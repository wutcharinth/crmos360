'use client';

import { useEffect, useState } from 'react';
import { LANG_COOKIE, isLang, type Lang } from '@/lib/marketing/lang';

type Mode = Lang | 'auto';

function readCookie(): Lang {
  if (typeof document === 'undefined') return 'th';
  const m = document.cookie.match(new RegExp(`(?:^|; )${LANG_COOKIE}=([^;]*)`));
  return isLang(m?.[1]) ? (m![1] as Lang) : 'th';
}

function writeCookie(v: Lang) {
  if (typeof document === 'undefined') return;
  document.cookie = `${LANG_COOKIE}=${v}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

function applyLang(v: Lang) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = v;
}

function detectBrowserLang(): Lang {
  if (typeof navigator === 'undefined') return 'th';
  const raw = (navigator.language || '').toLowerCase();
  return raw.startsWith('th') ? 'th' : 'en';
}

const OPTIONS: { value: Mode; label: string; hint: string }[] = [
  { value: 'th', label: 'ไทย', hint: 'Force Thai for the whole admin.' },
  { value: 'en', label: 'English', hint: 'Force English for the whole admin.' },
  {
    value: 'auto',
    label: 'Match browser',
    hint: 'Reads navigator.language and applies th or en automatically.',
  },
];

interface Props {
  onChange?: (lang: Lang) => void;
}

export function LangToggleAdmin({ onChange }: Props) {
  const [mode, setMode] = useState<Mode>('th');
  const [resolved, setResolved] = useState<Lang>('th');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const v = readCookie();
    setMode(v);
    setResolved(v);
    applyLang(v);
    setHydrated(true);
  }, []);

  const choose = (m: Mode) => {
    setMode(m);
    const next: Lang = m === 'auto' ? detectBrowserLang() : m;
    setResolved(next);
    writeCookie(next);
    applyLang(next);
    onChange?.(next);
  };

  return (
    <div className="space-y-2">
      {OPTIONS.map((opt) => {
        const active = hydrated && mode === opt.value;
        return (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
              active
                ? 'border-warm bg-warm-soft/50'
                : 'border-hairline bg-paper-2/40 hover:bg-paper-2'
            }`}
          >
            <input
              type="radio"
              name="lang"
              value={opt.value}
              checked={active}
              onChange={() => choose(opt.value)}
              className="mt-1 h-4 w-4 accent-warm"
            />
            <span className="flex-1">
              <span className="flex items-baseline gap-2">
                <span className="text-[14px] font-medium text-ink">
                  {opt.label}
                </span>
                {opt.value === 'auto' && hydrated && active ? (
                  <span className="font-mono text-[10px] uppercase tracking-widest text-warm">
                    → {resolved}
                  </span>
                ) : null}
              </span>
              <span className="mt-0.5 block text-[12.5px] leading-relaxed text-ink-2">
                {opt.hint}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
