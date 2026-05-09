'use client';

import { useState, useTransition } from 'react';

interface Props {
  flagKey: string;
  name: string;
  description: string;
  enabled: boolean;
  canEdit: boolean;
}

export function FlagToggleRow({ flagKey, name, description, enabled, canEdit }: Props) {
  const [on, setOn] = useState(enabled);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggle = () => {
    if (!canEdit || pending) return;
    const next = !on;
    setOn(next);
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/flags', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ flagKey, enabled: next }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error ?? `error ${res.status}`);
        }
      } catch (err) {
        setOn(!next);
        setError(err instanceof Error ? err.message : 'failed');
      }
    });
  };

  return (
    <div className="flex items-start justify-between gap-4 px-1 py-5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <p className="text-[15px] font-medium text-ink">{name}</p>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
            {flagKey}
          </span>
        </div>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{description}</p>
        {error && (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-rose">
            {error}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={toggle}
        disabled={!canEdit || pending}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full border transition-colors ${
          on ? 'border-warm bg-warm' : 'border-hairline bg-paper-2'
        } ${!canEdit ? 'opacity-50' : ''}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow-soft transition-transform ${
            on ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
