'use client';

import { useState } from 'react';

type Vertical = 'all' | 'commerce' | 'customer-ops' | 'services';
type Channel = 'all' | 'line' | 'shopee' | 'lazada' | 'tiktok' | 'messenger' | 'instagram';
type DateRange = '7d' | '30d' | '90d' | 'qtd';

const verticals: { id: Vertical; label: string }[] = [
  { id: 'all', label: 'All verticals' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'customer-ops', label: 'Customer-ops' },
  { id: 'services', label: 'Services' },
];

/**
 * Top-of-page filter strip + Export PDF stub. Filters do not actually
 * mutate fixture data in M1.5 — visual selection only, with a small
 * "filtered locally" affordance to remind whoever's demoing this. The
 * Export PDF modal explicitly tells the user PDF export ships in Chunk 21.
 */
export function IntelligenceFilters() {
  const [vertical, setVertical] = useState<Vertical>('all');
  const [channel, setChannel] = useState<Channel>('all');
  const [range, setRange] = useState<DateRange>('30d');
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="border-t border-hairline">
      <div className="flex flex-col gap-y-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-x-6">
        {/* Vertical — underline-on-active tabs */}
        <nav
          className="flex flex-wrap items-baseline gap-x-5 gap-y-2"
          aria-label="Filter by vertical"
        >
          {verticals.map((v) => {
            const active = v.id === vertical;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setVertical(v.id)}
                className={`relative pb-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                  active ? 'text-ink' : 'text-mute hover:text-ink-2'
                }`}
              >
                {v.label}
                {active && (
                  <span
                    className="absolute inset-x-0 -bottom-px h-px bg-warm"
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Channel + Date + Export — right cluster */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <label className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
            Channel
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as Channel)}
              className="rounded-md border border-hairline bg-paper px-2.5 py-1.5 font-sans text-[12.5px] normal-case tracking-normal text-ink focus:border-warm focus:outline-none"
            >
              <option value="all">All</option>
              <option value="line">LINE</option>
              <option value="shopee">Shopee</option>
              <option value="lazada">Lazada</option>
              <option value="tiktok">TikTok</option>
              <option value="messenger">Messenger</option>
              <option value="instagram">Instagram</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
            Range
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as DateRange)}
              className="rounded-md border border-hairline bg-paper px-2.5 py-1.5 font-sans text-[12.5px] normal-case tracking-normal text-ink focus:border-warm focus:outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="qtd">Quarter to date</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => setShowExport(true)}
            className="rounded-md border border-hairline bg-paper px-3 py-1.5 text-[12.5px] text-ink-2 transition-colors hover:border-warm hover:text-warm"
          >
            Export PDF
          </button>
        </div>
      </div>

      {showExport && (
        <ExportModal onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}

function ExportModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-pdf-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6"
      onClick={onClose}
    >
      <div
        className="max-w-[420px] rounded-lg border border-hairline bg-paper p-7 shadow-terminal"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm">
          Export · stub
        </p>
        <h2
          id="export-pdf-title"
          className="mt-3 text-[20px] font-semibold leading-tight text-ink"
        >
          PDF export ships in M1.5 · Chunk 21
        </h2>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
          The dashboard is render-ready, but the headless-render pipeline lands
          in the back half of M1.5. Until then, screen-record or use the browser
          print dialog.
        </p>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-warm px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-warm-2"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
