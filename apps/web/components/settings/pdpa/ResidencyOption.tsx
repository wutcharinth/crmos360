'use client';

import { type ReactNode } from 'react';

export interface ResidencyOptionProps {
  value: 'TH' | 'SG' | 'EU';
  label: string;
  region: string;
  latency: string;
  diagram: ReactNode;
  selected: boolean;
  onSelect: (value: 'TH' | 'SG' | 'EU') => void;
}

export function ResidencyOption({
  value,
  label,
  region,
  latency,
  diagram,
  selected,
  onSelect,
}: ResidencyOptionProps) {
  return (
    <label
      className={`flex cursor-pointer flex-col gap-3 rounded-xl border p-5 transition-colors ${
        selected
          ? 'border-warm bg-warm-soft/40'
          : 'border-hairline bg-paper-2 hover:border-hairline-2'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="residency"
              value={value}
              checked={selected}
              onChange={() => onSelect(value)}
              className="h-4 w-4 accent-warm"
            />
            <span className="text-[13px] font-mono font-medium tracking-wide text-ink">
              {value}
            </span>
          </div>
          <p className="mt-2 text-[15px] font-semibold text-ink">{label}</p>
          <p className="text-[12px] text-ink-2">{region}</p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          {latency}
        </span>
      </div>
      <pre className="overflow-x-auto whitespace-pre rounded-md border border-hairline bg-paper p-3 font-mono text-[10.5px] leading-snug text-ink-2">
        {diagram}
      </pre>
    </label>
  );
}
