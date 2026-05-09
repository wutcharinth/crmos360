'use client';

import { useEffect, useState } from 'react';
import { useSkin } from '@/components/skin-provider';
import { isLang, type Lang } from '@/lib/marketing/lang';
import { isDensity, type Density } from '@/lib/settings/density';

/**
 * Bottom-of-page preview that reflects current skin / density / language.
 * Reads density + lang directly off the live <html> element so it updates
 * as soon as DensityToggle / LangToggleAdmin write to it. Skin comes from
 * the SkinProvider context.
 */
export function LivePreview() {
  const { resolvedSkin } = useSkin();
  const [lang, setLang] = useState<Lang>('th');
  const [density, setDensity] = useState<Density>('comfortable');

  useEffect(() => {
    const root = document.documentElement;

    const sync = () => {
      const l = root.getAttribute('lang') ?? 'th';
      const d = root.dataset.density ?? 'comfortable';
      setLang(isLang(l) ? l : 'th');
      setDensity(isDensity(d) ? d : 'comfortable');
    };
    sync();

    const obs = new MutationObserver(sync);
    obs.observe(root, {
      attributes: true,
      attributeFilter: ['lang', 'data-density', 'class'],
    });
    return () => obs.disconnect();
  }, []);

  const compact = density === 'compact';
  const rowPad = compact ? 'px-3 py-2' : 'px-4 py-3';
  const gap = compact ? 'gap-3' : 'gap-4';

  return (
    <div className="rounded-xl border border-hairline bg-paper-2/40 p-5">
      <div className="flex items-center justify-between">
        <p className="label-mono">Live preview</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
          {resolvedSkin} · {density} · {lang}
        </p>
      </div>

      <div className={`mt-4 space-y-${compact ? '2' : '3'}`}>
        {/* Inbox row */}
        <div
          className={`flex items-center ${gap} rounded-lg border border-hairline bg-paper ${rowPad}`}
        >
          <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-warm-soft font-mono text-[11px] font-semibold text-warm">
            NP
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="truncate text-[13.5px] font-medium text-ink">
                <span className="th-only">คุณนภาพร</span>
                <span className="en-only">Napaporn</span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#06C755]">
                LINE
              </span>
            </div>
            <p className="truncate text-[12.5px] text-ink-2">
              <span className="th-only">สั่งของแล้วของยังไม่ถึงเลยค่ะ</span>
              <span className="en-only">Order placed but parcel not arrived yet</span>
            </p>
          </div>
          <span className="font-mono text-[10px] tabular-nums text-mute">02:14</span>
        </div>

        {/* Status pills + button */}
        <div className={`flex flex-wrap items-center ${gap}`}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-soft px-2.5 py-1 text-[11px] font-medium text-mint">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            <span className="th-only">ตอบอัตโนมัติ</span>
            <span className="en-only">Auto-replied</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-paper px-2.5 py-1 text-[11px] font-medium text-ink-2">
            <span className="h-1.5 w-1.5 rounded-full bg-warm" />
            <span className="th-only">รอมนุษย์</span>
            <span className="en-only">Needs human</span>
          </span>
          <button
            type="button"
            className={`ml-auto inline-flex items-center gap-2 rounded-md bg-warm font-medium text-paper shadow-soft transition-colors hover:bg-warm-2 ${
              compact ? 'px-3 py-1.5 text-[12px]' : 'px-4 py-2 text-[13px]'
            }`}
          >
            <span className="th-only">ส่งคำตอบ</span>
            <span className="en-only">Send reply</span>
          </button>
        </div>
      </div>
    </div>
  );
}
