'use client';

import { useSkin, type Skin } from '@/components/skin-provider';

const OPTIONS: { value: Skin; label: string; hint: string }[] = [
  { value: 'daylight', label: 'Daylight', hint: 'Light · editorial' },
  { value: 'cockpit', label: 'Cockpit', hint: 'Dark · ops-grade' },
  { value: 'system', label: 'System', hint: 'Match OS preference' },
];

export function SkinSwitcher() {
  const { skin, resolvedSkin, setSkin } = useSkin();

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-hairline bg-paper-2 p-1">
      {OPTIONS.map((opt) => {
        const active = opt.value === skin;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setSkin(opt.value)}
            aria-pressed={active}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? 'bg-paper text-ink shadow-soft'
                : 'text-ink-2 hover:text-ink'
            }`}
            title={opt.hint}
          >
            {opt.label}
          </button>
        );
      })}
      <span className="ml-2 mr-1 font-mono text-[10px] uppercase tracking-widest text-mute">
        {resolvedSkin}
      </span>
    </div>
  );
}
