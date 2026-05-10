/**
 * Self-serve dogfood section, modeled on JongToh's "ask the Jongtoh LINE
 * OA — the same AI that answers your customers will answer you" pattern
 * (`landing.ts:871-877`). Single conviction line, large, centered, with
 * one CTA pointing at the live concierge.
 */
import Link from 'next/link';

export function DogfoodPitch() {
  return (
    <section className="border-t border-hairline py-20">
      <div className="mx-auto w-[min(820px,calc(100%-48px))] text-center">
        <p className="label-mono">
          <span className="th-only">ลองคุยได้เลย</span>
          <span className="en-only">Try it live</span>
        </p>
        <p className="mt-6 text-[clamp(22px,2.6vw,32px)] font-light leading-snug tracking-tight text-ink">
          <span className="th-only">
            ลองคุยกับ AI{' '}
            <em className="not-italic font-semibold text-warm whitespace-nowrap">ตัวเดียวกับ</em>
            <br />
            ที่ลูกค้าของคุณจะได้คุยตั้งแต่วันแรก
          </span>
          <span className="en-only">
            Talk to the{' '}
            <em className="not-italic font-semibold text-warm whitespace-nowrap">same AI</em>
            <br />
            your customers will meet on day one
          </span>
        </p>
        <p className="mt-5 max-w-[60ch] mx-auto text-[14px] leading-relaxed text-ink-2">
          <span className="th-only">
            นี่ไม่ใช่เดโมที่ตอบตามสคริปต์ แต่คือ AI ตัวจริงที่ใช้ระบบเดียวกับหน้าร้านของคุณ
            ถ้าตอบได้ดี คุณก็มั่นใจได้มากขึ้น ถ้าตอบพลาด ระบบจะเก็บเป็น feedback
            เพื่อปรับให้ดีก่อนเริ่มใช้งานจริง
          </span>
          <span className="en-only">
            This is not a scripted demo. It is the same AI flow your business can use
            with real customers. If it answers well, you know what to expect. If it
            misses, that becomes feedback before you go live.
          </span>
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/demo"
            className="rounded-lg bg-warm px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-warm-2"
          >
            <span className="th-only">ดูเดโม + ลองคุย</span>
            <span className="en-only">Watch demo + try it</span>
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg border border-hairline bg-paper-2 px-5 py-3 text-[14px] font-medium text-ink transition-colors hover:bg-paper-3"
          >
            <span className="th-only">ดูราคา</span>
            <span className="en-only">Pricing</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
