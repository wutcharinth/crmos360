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
          <span className="th-only">ลองเองได้เลย</span>
          <span className="en-only">Try it on us</span>
        </p>
        <p className="mt-6 text-[clamp(22px,2.6vw,32px)] font-light leading-snug tracking-tight text-ink">
          <span className="th-only">
            AI ที่ตอบคุณบนหน้านี้คือ{' '}
            <em className="not-italic font-semibold text-warm whitespace-nowrap">ตัวเดียวกัน</em>{' '}
            กับที่คุณจะส่งให้ตอบลูกค้าของคุณวันแรก.
          </span>
          <span className="en-only">
            The concierge answering you on this page is the{' '}
            <em className="not-italic font-semibold text-warm whitespace-nowrap">same AI</em> you&rsquo;ll
            ship to your customers on day one.
          </span>
        </p>
        <p className="mt-5 max-w-[60ch] mx-auto text-[14px] leading-relaxed text-ink-2">
          <span className="th-only">
            ถ้ามันขายคุณได้ มันก็ขายลูกค้าคุณได้. ถ้ามันพลาด เป็น feedback loop
            ที่เราอยากรู้ก่อนคุณยิ่ง.
          </span>
          <span className="en-only">
            If it can sell you, it can sell your customers. If it fumbles, that&rsquo;s a
            feedback loop we&rsquo;d rather know about now than later.
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
            <span className="th-only">ราคา</span>
            <span className="en-only">Pricing</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
