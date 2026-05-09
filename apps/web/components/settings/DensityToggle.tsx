'use client';

import { useEffect, useState } from 'react';
import { DENSITY_COOKIE, isDensity, type Density } from '@/lib/settings/density';

const OPTIONS: { value: Density; label: string; hint: string }[] = [
  {
    value: 'comfortable',
    label: 'Comfortable',
    hint: 'Default spacing. Easier to scan in long sessions.',
  },
  {
    value: 'compact',
    label: 'Compact',
    hint: 'Reduces inbox + dashboard spacing by ~30%. More rows on screen.',
  },
];

function readCookie(): Density {
  if (typeof document === 'undefined') return 'comfortable';
  const m = document.cookie.match(new RegExp(`(?:^|; )${DENSITY_COOKIE}=([^;]*)`));
  return isDensity(m?.[1]) ? (m![1] as Density) : 'comfortable';
}

function writeCookie(v: Density) {
  if (typeof document === 'undefined') return;
  document.cookie = `${DENSITY_COOKIE}=${v}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

function applyDensity(v: Density) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.density = v;
}

interface Props {
  onChange?: (v: Density) => void;
}

export function DensityToggle({ onChange }: Props) {
  const [density, setDensity] = useState<Density>('comfortable');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const v = readCookie();
    setDensity(v);
    applyDensity(v);
    setHydrated(true);
  }, []);

  const choose = (v: Density) => {
    setDensity(v);
    writeCookie(v);
    applyDensity(v);
    onChange?.(v);
  };

  return (
    <div className="space-y-2">
      {OPTIONS.map((opt) => {
        const active = hydrated && density === opt.value;
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
              name="density"
              value={opt.value}
              checked={active}
              onChange={() => choose(opt.value)}
              className="mt-1 h-4 w-4 accent-warm"
            />
            <span className="flex-1">
              <span className="block text-[14px] font-medium text-ink">
                {opt.label}
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
