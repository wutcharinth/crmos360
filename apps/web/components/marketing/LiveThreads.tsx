'use client';

import { useEffect, useState } from 'react';
import { ChannelIcon, type ChannelKey } from '@/components/ui/channel-icon';

type Tag = 'Auto' | 'Approval' | 'Escalate' | 'Growth';

interface Thread {
  sender: string;
  channel: ChannelKey;
  body: string;
  tag: Tag;
  hot?: boolean;
}

const tagClass: Record<Tag, string> = {
  Auto: 'text-mint border-mint/30 bg-mint-soft',
  Approval: 'text-warm border-warm/30 bg-warm-soft',
  Escalate: 'text-rose border-rose/30 bg-[hsl(var(--rose)/0.06)]',
  Growth: 'text-mute border-hairline bg-paper',
};

/**
 * Scenes for the hero terminal artifact. One scene at a time fills the
 * 4 visible thread rows. We rotate every 5.5s to give a "live, watching"
 * feel without distracting from the headline copy. Pause on hover.
 *
 * Adapted from JongToh's `SCENES` pattern (landing.ts:1023-1131) which
 * uses requestAnimationFrame; here we use setInterval since the cadence
 * is slower and the FPS doesn't need to be tuned.
 */
const SCENES: Thread[][] = [
  [
    {
      sender: 'คุณพิมพ์พร',
      channel: 'line',
      body: 'พัสดุถึงไหนแล้วคะ. AI ตอบเองด้วย confidence 94%',
      tag: 'Auto',
      hot: true,
    },
    {
      sender: 'TikTok buyer',
      channel: 'tiktok',
      body: 'wholesale 50 pcs ราคา? ส่งให้ทีม approve',
      tag: 'Approval',
    },
    {
      sender: 'Shopee complaint',
      channel: 'shopee',
      body: 'รอของ 2 อาทิตย์, escalate ไปหัวหน้าทีม + brief acknowledgment',
      tag: 'Escalate',
    },
    {
      sender: 'Instagram lead',
      channel: 'instagram',
      body: 'discovery set ราคาเท่าไรคะ, แนะนำ + คูปอง first-time',
      tag: 'Growth',
    },
  ],
  [
    {
      sender: 'อรวรรณ',
      channel: 'line',
      body: 'มี cleansing balm ใหม่ไหม. memory: paraben-free, Kerry shipper',
      tag: 'Auto',
      hot: true,
    },
    {
      sender: 'Lin Wei',
      channel: 'shopee',
      body: 'wholesale 50 pcs price, verify SKU + tier first',
      tag: 'Approval',
    },
    {
      sender: '@somchai_real',
      channel: 'instagram',
      body: 'sentiment: negative + keyword "แจ้งความ", escalate within 5 min',
      tag: 'Escalate',
    },
    {
      sender: 'Returning buyer',
      channel: 'tiktok',
      body: 'VIP discount code, auto-rule R-008 candidate, 31 hits/30d',
      tag: 'Growth',
    },
  ],
  [
    {
      sender: 'Khun Apinya',
      channel: 'line',
      body: 'หลัง treatment ปวด 3 วัน, clinical rule: page on-duty dentist',
      tag: 'Escalate',
      hot: true,
    },
    {
      sender: 'Khun Naphas',
      channel: 'line',
      body: 'รอบ TGAT รอบใหม่. auto-reply 3 cohort dates + price range',
      tag: 'Auto',
    },
    {
      sender: 'Khun Pakorn',
      channel: 'line',
      body: 'ของล็อต PO #4521. pre-pack 95%, Net-15 confirmed',
      tag: 'Auto',
    },
    {
      sender: 'B2B procurement',
      channel: 'email',
      body: 'ราคา M8x30 grade 8.8 200 ชิ้น, route to พี่อ้อย, draft only',
      tag: 'Approval',
    },
  ],
];

const ROTATE_MS = 5500;

export function LiveThreads() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setSceneIndex((i) => (i + 1) % SCENES.length);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [paused]);

  const threads = SCENES[sceneIndex]!;

  return (
    <div
      className="flex flex-col gap-2 border-hairline px-3.5 py-3.5 md:border-r"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex justify-between px-1 pb-1.5">
        <span className="label-mono">Live · Inbox</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mint">
          ● 4 active · scene {sceneIndex + 1}/{SCENES.length}
        </span>
      </div>
      <div className="relative space-y-2">
        {threads.map((t, i) => (
          <div
            key={`${sceneIndex}-${t.sender}`}
            className={`group rounded-lg border border-hairline bg-paper px-3.5 py-3 transition-all duration-300 ${
              t.hot ? 'border-l-2 border-l-warm' : ''
            } animate-[liveFade_0.4s_ease-out]`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <ChannelIcon
                  channel={t.channel}
                  size={12}
                  className="flex-shrink-0 text-ink-2"
                />
                <b className="truncate text-[12.5px] font-medium text-ink">
                  {t.sender}
                </b>
              </span>
              <span
                className={`flex-shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${tagClass[t.tag]}`}
              >
                {t.tag}
              </span>
            </div>
            <p className="line-clamp-2 text-[12px] leading-snug text-ink-2">{t.body}</p>
          </div>
        ))}
      </div>

      {/* Scene dots */}
      <div className="mt-2 flex items-center justify-end gap-1.5 px-1">
        {SCENES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSceneIndex(i)}
            aria-label={`Show scene ${i + 1}`}
            className={`h-1.5 w-1.5 rounded-full transition-all ${
              i === sceneIndex ? 'w-5 bg-warm' : 'bg-hairline-2 hover:bg-mute'
            }`}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes liveFade {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
