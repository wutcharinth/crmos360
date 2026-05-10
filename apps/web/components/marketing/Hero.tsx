import Link from 'next/link';
import { heroPromises } from '@/lib/marketing/data';
import { CombineStage } from '@/components/marketing/CombineStage';

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
            <span className="th-only">AI ADMIN · ตอบเองเมื่อชัวร์ ส่งต่อเมื่อสำคัญ</span>
            <span className="en-only">AI ADMIN · Replies when sure. Hands over when it matters.</span>
          </span>

          <h1 className="display-xl text-ink">
            <span className="th-only">
              มี <em className="not-italic accent-word">AI แอดมิน</em> ช่วยตอบลูกค้า
              <br />
              <span className="display-light">เหมือนมีทีมเพิ่ม</span>
              <br />
              <span className="display-light">แต่ยังควบคุมได้ทุกคำตอบ</span>
            </span>
            <span className="en-only">
              An <em className="not-italic accent-word">AI admin</em> for customer chats
              <br />
              <span className="display-light">that works like an extra team member</span>
              <br />
              <span className="display-light">without losing control of your brand</span>
            </span>
          </h1>

          <p className="lead mt-6">
            <span className="th-only">
              รวมแชทจาก LINE OA, Shopee, TikTok Shop, Lazada, Instagram, Facebook
              และ Email ไว้ในกล่องเดียว ให้ AI ช่วยตอบคำถามซ้ำ ๆ อัตโนมัติเมื่อมั่นใจ
              ร่างคำตอบให้ทีมตรวจเมื่อยังไม่ชัวร์ และส่งต่อเคสสำคัญทันที.
            </span>
            <span className="en-only">
              Bring chats from LINE OA, Shopee, TikTok Shop, Lazada, Instagram, Facebook,
              and Email into one inbox. FlowAIOS answers repetitive questions automatically
              when confident, drafts replies for your team to approve when unsure, and
              escalates important cases instantly.
            </span>
          </p>

          <div className="mt-9 flex items-center gap-3.5">
            <Link
              href="/demo"
              className="rounded-lg bg-warm px-5 py-3.5 text-[14px] font-medium text-paper shadow-cta/0 transition-all duration-200 hover:-translate-y-px hover:bg-warm-2 hover:shadow-cta"
            >
              <span className="th-only">เริ่มใช้กับ LINE OA ใน 30 นาที</span>
              <span className="en-only">Start with your LINE OA in 30 minutes</span>
            </Link>
            <Link
              href="/demo"
              className="group inline-flex items-center gap-1.5 px-3 py-3.5 text-[14px] text-ink transition-colors hover:text-warm"
            >
              <span className="th-only">ดูเดโม 30 วินาที</span>
              <span className="en-only">Watch 30s demo</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-3.5 rounded-xl border border-hairline bg-gradient-to-b from-paper-2 to-paper px-6 py-5">
            {heroPromises.map((p) => (
              <span key={p.en} className="flex items-center gap-2.5 text-[13px] text-ink-2">
                <span className="h-1.5 w-1.5 rounded-full bg-warm shadow-[0_0_6px_hsl(var(--warm)/0.45)]" />
                <span className="th-only">{p.th}</span>
                <span className="en-only">{p.en}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Hero stage: customer channels converging into the FlowAIOS inbox */}
        <CombineStage />
      </div>
    </section>
  );
}
