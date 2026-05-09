'use client';

import { useEffect, useState } from 'react';
import { LANG_COOKIE, isLang, type Lang } from '@/lib/marketing/lang';

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

export function LangToggle() {
  const [lang, setLang] = useState<Lang>('th');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const v = readCookie();
    setLang(v);
    applyLang(v);
    setHydrated(true);
  }, []);

  const choose = (v: Lang) => {
    setLang(v);
    writeCookie(v);
    applyLang(v);
  };

  if (!hydrated) return null;

  return (
    <div className="inline-flex items-center gap-0 rounded-full border border-hairline bg-paper-2 p-0.5 font-mono text-[10px] uppercase tracking-[0.14em]">
      {(['th', 'en'] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => choose(v)}
          aria-pressed={lang === v}
          className={`rounded-full px-2 py-1 transition-colors ${
            lang === v ? 'bg-paper text-ink' : 'text-mute hover:text-ink'
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
