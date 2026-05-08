import Link from 'next/link';

export function Cta() {
  return (
    <section
      id="contact"
      className="relative border-t border-hairline bg-ink py-28 text-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_900px_500px_at_50%_-100px,hsl(var(--warm)/0.18),transparent_60%)]"
      />
      <div className="relative mx-auto w-[min(880px,calc(100%-48px))] text-center">
        <span className="label-mono inline-block !text-[hsl(var(--warm))] tracking-[0.32em]">
          FlowAIOS
        </span>
        <h2 className="mt-5 display-lg text-paper">
          เริ่มสร้าง AI OS สำหรับ Customer Operations
          <br />
          ของธุรกิจคุณ
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-[16px] leading-relaxed text-paper/80">
          รวมแชทจาก LINE OA, TikTok Shop, Shopee, Lazada, Facebook, Instagram
          และช่องทางอื่น พร้อม AI Agents ที่ช่วยตอบ จำ ทำงาน แนะนำการตั้งค่า
          และเรียนรู้จากการใช้งานจริง
        </p>
        <div className="mt-9 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-warm px-6 py-3.5 text-[14px] font-medium text-paper transition-all duration-200 hover:-translate-y-px hover:bg-warm-2 hover:shadow-cta"
          >
            ขอดูเดโม FlowAIOS
          </Link>
          <Link
            href="#top"
            className="group inline-flex items-center gap-1.5 px-3 py-3.5 text-[14px] text-paper transition-colors hover:text-warm"
          >
            กลับไปดูหน้าแรก
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
