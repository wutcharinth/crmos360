import Link from 'next/link';
import { channels, heroPromises, heroThreads, type ThreadTag } from '@/lib/marketing/data';

const tagClass: Record<ThreadTag, string> = {
  Auto:
    'text-mint border-mint/30 bg-mint-soft',
  Review:
    'text-warm border-warm/30 bg-warm-soft',
  Escalate:
    'text-rose border-rose/30 bg-[hsl(var(--rose)/0.06)]',
  Growth:
    'text-mute border-hairline bg-paper',
};

export function Hero() {
  return (
    <section id="top" className="relative pb-20 pt-24">
      {/* subtle warm radial behind hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-[700px] bg-[radial-gradient(ellipse_1400px_700px_at_50%_-300px,hsl(var(--warm)/0.06),transparent_65%)]"
      />

      <div className="relative mx-auto grid w-[min(1240px,calc(100%-48px))] items-center gap-14 lg:grid-cols-[1fr_1.15fr]">
        {/* Hero text */}
        <div>
          <span className="label-mono mb-8 inline-flex items-center gap-2.5 rounded-full border border-hairline bg-paper px-3 py-1.5 text-ink-2 normal-case tracking-widest">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint shadow-[0_0_8px_hsl(var(--mint))]" />
            AI OS · Customer Operations
          </span>

          <h1 className="display-xl text-ink">
            ระบบเดียวที่
            <br />
            <em className="not-italic font-semibold text-warm">คิด ตอบ ทำ</em>
            <br />
            และเรียนรู้
          </h1>

          <p className="lead mt-6">
            รวมแชทลูกค้าจาก LINE OA, Facebook, Instagram, TikTok Shop, Shopee, Lazada
            และช่องทางอื่นไว้ในระบบเดียว พร้อม AI Agents ที่ตอบเองได้เมื่อมั่นใจ
            รออนุมัติเมื่อเคสสำคัญ ทำงานหลังบ้าน และเรียนรู้จากธุรกิจของคุณอย่างต่อเนื่อง
          </p>

          <div className="mt-9 flex items-center gap-3.5">
            <Link
              href="/signup"
              className="rounded-lg bg-warm px-5 py-3.5 text-[14px] font-medium text-paper shadow-cta/0 transition-all duration-200 hover:-translate-y-px hover:bg-warm-2 hover:shadow-cta"
            >
              ขอดูเดโม FlowAIOS
            </Link>
            <Link
              href="#ai-os"
              className="group inline-flex items-center gap-1.5 px-3 py-3.5 text-[14px] text-ink transition-colors hover:text-warm"
            >
              ดู USP หลัก
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-3.5 rounded-xl border border-hairline bg-gradient-to-b from-paper-2 to-paper px-6 py-5">
            {heroPromises.map((p) => (
              <span key={p} className="flex items-center gap-2.5 text-[13px] text-ink-2">
                <span className="h-1.5 w-1.5 rounded-full bg-warm shadow-[0_0_6px_hsl(var(--warm)/0.45)]" />
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Terminal artifact */}
        <div
          aria-hidden
          className="relative overflow-hidden rounded-2xl border border-hairline bg-paper shadow-terminal"
        >
          {/* top accent line */}
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--warm)/0.40),transparent)]" />

          {/* term bar */}
          <div className="flex items-center justify-between border-b border-hairline bg-paper-2 px-3.5 py-3">
            <div className="flex items-center gap-3.5">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
              </div>
              <span className="font-mono text-[11px] tracking-wide text-mute">
                <b className="font-medium text-ink-2">flowaios.app</b> / inbox
              </span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/22 bg-mint-soft px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-mint">
              <span className="h-1.5 w-1.5 rounded-full bg-mint shadow-[0_0_6px_hsl(var(--mint)/0.5)]" />
              AI OS Online
            </span>
          </div>

          {/* term grid: 110px | 1fr | 230px on desktop, single col on mobile */}
          <div className="grid-bg grid min-h-[420px] grid-cols-1 md:grid-cols-[110px_1fr_230px]">
            {/* channel rail */}
            <div className="flex flex-col gap-1.5 border-hairline px-3 py-3.5 md:border-r">
              <div className="label-mono px-1.5 pb-2">Channels</div>
              {channels.map((ch) => (
                <div
                  key={ch.name}
                  className={`flex items-center justify-between rounded-md px-2.5 py-2 text-[12.5px] transition-colors ${
                    ch.active
                      ? 'bg-warm-soft text-ink shadow-[inset_0_0_0_1px_hsl(var(--warm)/0.3)]'
                      : 'text-ink-2 hover:bg-paper-2 hover:text-ink'
                  }`}
                >
                  {ch.name}
                  <small
                    className={`font-mono text-[10.5px] tabular-nums ${
                      ch.active ? 'text-warm' : 'text-mute'
                    }`}
                  >
                    {ch.count}
                  </small>
                </div>
              ))}
            </div>

            {/* threads */}
            <div className="flex flex-col gap-2 border-hairline px-3.5 py-3.5 md:border-r">
              <div className="flex justify-between px-1 pb-1.5">
                <span className="label-mono">Live · Inbox</span>
                <span className="label-mono not-italic text-mint">● 4 active</span>
              </div>
              {heroThreads.map((t) => (
                <div
                  key={t.sender}
                  className={`group rounded-lg border border-hairline bg-paper px-3.5 py-3 transition-all duration-200 hover:border-hairline-2 hover:translate-x-0.5 ${
                    t.hot ? 'border-l-2 border-l-warm' : ''
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <b className="text-[12.5px] font-medium text-ink">{t.sender}</b>
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${tagClass[t.tag]}`}
                    >
                      {t.tag}
                    </span>
                  </div>
                  <p className="text-[12px] leading-snug text-ink-2">{t.body}</p>
                </div>
              ))}
            </div>

            {/* intel */}
            <div className="flex flex-col gap-3 px-3.5 py-3.5">
              <div className="label-mono pb-1">Advisor</div>
              <div className="rounded-lg border border-hairline bg-paper px-3.5 py-3">
                <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink">
                  Auto-Reply rule
                </h4>
                <p className="text-[12px] leading-snug text-ink-2">
                  เปิด Auto-Reply สำหรับ tracking request ที่มั่นใจ &gt;85%
                </p>
                <div className="relative mt-2.5 h-1 overflow-hidden rounded-full bg-paper-3">
                  <span className="absolute inset-y-0 left-0 w-[91%] rounded-full bg-gradient-to-r from-warm to-mint" />
                  <small className="absolute -top-4 right-1.5 font-mono text-[10px] tracking-wide text-mint">
                    91%
                  </small>
                </div>
              </div>
              <div className="rounded-lg border border-hairline bg-paper px-3.5 py-3">
                <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink">
                  Customer Memory
                </h4>
                <ul className="m-0 list-none p-0">
                  {['ชอบโปรส่งฟรี', 'เคย complaint เรื่องส่งช้า', 'tone สุภาพและกระชับ'].map((m) => (
                    <li
                      key={m}
                      className="relative py-0.5 pl-3.5 text-[12px] text-ink-2 before:absolute before:left-0 before:top-3 before:h-px before:w-1.5 before:bg-warm"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
