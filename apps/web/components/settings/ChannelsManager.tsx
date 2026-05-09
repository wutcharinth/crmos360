'use client';

import { useMemo, useState } from 'react';
import {
  verticalProfiles,
  type Vertical,
} from '@/lib/marketing/vertical';

/**
 * One row per supported channel. Description is the operator-facing one-liner
 * — what this channel actually means to your inbox if you toggle it on.
 */
interface Channel {
  id: string;
  /** Matches the labels in vertical.ts `channels` arrays. */
  label: string;
  short: string; // 2-letter logo placeholder
  brandHex: string;
  description: string;
}

const CHANNELS: ReadonlyArray<Channel> = [
  { id: 'line', label: 'LINE OA', short: 'LN', brandHex: '#06C755', description: 'Primary anchor channel — Thai market default.' },
  { id: 'shopee', label: 'Shopee', short: 'SP', brandHex: '#EE4D2D', description: 'Marketplace inbox — chat + order questions.' },
  { id: 'lazada', label: 'Lazada', short: 'LZ', brandHex: '#0F146D', description: 'Marketplace inbox — slower SLA, formal tone.' },
  { id: 'tiktok', label: 'TikTok Shop', short: 'TT', brandHex: '#000000', description: 'Live + DM replies driven from short-form ads.' },
  { id: 'instagram', label: 'Instagram', short: 'IG', brandHex: '#E4405F', description: 'DM ad replies + story mentions.' },
  { id: 'facebook', label: 'Facebook', short: 'FB', brandHex: '#0078FF', description: 'Messenger threads + page comments.' },
  { id: 'email', label: 'Email', short: 'EM', brandHex: '#4A4F52', description: 'Long-form support tickets + escalations.' },
  { id: 'whatsapp', label: 'WhatsApp', short: 'WA', brandHex: '#25D366', description: 'Cross-border B2B + diaspora customers.' },
];

const PRESETS: ReadonlyArray<{ id: Vertical | 'custom'; label: string }> = [
  { id: 'commerce', label: 'DTC commerce' },
  { id: 'customer-ops', label: 'Customer-ops' },
  { id: 'services', label: 'Services' },
  { id: 'b2b', label: 'B2B' },
  { id: 'custom', label: 'Custom' },
];

function presetEnabledIds(preset: Vertical | 'custom'): Set<string> | null {
  if (preset === 'custom') return null;
  const profile = verticalProfiles.find((p) => p.id === preset);
  if (!profile) return new Set();
  // profile.channels uses labels (e.g. 'LINE OA') — map back to ids
  const labelToId = new Map(CHANNELS.map((c) => [c.label, c.id]));
  return new Set(
    profile.channels
      .map((label) => labelToId.get(label))
      .filter((v): v is string => Boolean(v)),
  );
}

export function ChannelsManager() {
  const [preset, setPreset] = useState<Vertical | 'custom'>('commerce');
  const [enabled, setEnabled] = useState<Set<string>>(
    () => presetEnabledIds('commerce') ?? new Set(),
  );
  const [toast, setToast] = useState<string | null>(null);

  const choosePreset = (id: Vertical | 'custom') => {
    setPreset(id);
    const next = presetEnabledIds(id);
    if (next) {
      setEnabled(next);
      flashSaved();
    }
  };

  const toggle = (id: string) => {
    setPreset('custom');
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    flashSaved();
  };

  const flashSaved = () => {
    setToast('Saved (mock)');
    window.clearTimeout((flashSaved as unknown as { _t?: number })._t);
    (flashSaved as unknown as { _t: number })._t = window.setTimeout(
      () => setToast(null),
      1600,
    );
  };

  const activeList = useMemo(
    () =>
      CHANNELS.filter((c) => enabled.has(c.id))
        .map((c) => c.label)
        .join(' · ') || 'none',
    [enabled],
  );

  return (
    <div className="space-y-10">
      {/* Vertical preset tabs — horizontal underline */}
      <div>
        <p className="label-mono">Vertical preset</p>
        <div className="mt-3 flex flex-wrap gap-x-1 gap-y-2 border-b border-hairline">
          {PRESETS.map((p) => {
            const active = preset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => choosePreset(p.id)}
                aria-pressed={active}
                className={`-mb-px border-b-2 px-3 py-2 text-[13px] font-medium transition-colors ${
                  active
                    ? 'border-warm text-ink'
                    : 'border-transparent text-ink-2 hover:text-ink'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Channel rows */}
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <p className="label-mono">Channels</p>
          <p className="font-mono text-[11px] tracking-tight text-ink-2">
            <span className="text-mute">current:</span> {activeList}
          </p>
        </div>

        <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
          {CHANNELS.map((c) => {
            const on = enabled.has(c.id);
            return (
              <li
                key={c.id}
                className="flex items-center gap-4 px-1 py-3.5"
              >
                <span
                  className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-semibold text-paper"
                  style={{ backgroundColor: c.brandHex }}
                  aria-hidden
                >
                  {c.short}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[14px] font-medium text-ink">
                      {c.label}
                    </span>
                    {on ? (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-mint">
                        on
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[12.5px] text-ink-2">{c.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  onClick={() => toggle(c.id)}
                  className={`relative h-6 w-11 flex-shrink-0 rounded-full border transition-colors ${
                    on
                      ? 'border-warm bg-warm'
                      : 'border-hairline bg-paper-2'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow-soft transition-transform ${
                      on ? 'translate-x-[22px]' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-3 flex h-5 items-center">
          {toast ? (
            <span className="font-mono text-[10px] uppercase tracking-widest text-mint">
              {toast}
            </span>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
              Changes save automatically.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
