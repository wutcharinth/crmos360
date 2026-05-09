/**
 * Numbered 01/02/03 trust band, modeled on JongToh's `landing.ts:776-797`.
 * Cleaner alternative to security-badge logos when you don't yet have any
 * paying-customer testimonials or SOC2 audits. Three real claims, each
 * verifiable today.
 */
export function TrustBand() {
  return (
    <section className="border-t border-hairline py-16">
      <div className="mx-auto w-[min(1080px,calc(100%-48px))]">
        <p className="label-mono">
          <span className="th-only">เหตุผลที่ไว้ใจได้</span>
          <span className="en-only">Why this is safe to ship</span>
        </p>
        <h2 className="display-md mt-3 max-w-[28ch]">
          <span className="th-only">
            ไม่ใช่ trust-badge wallpaper.{' '}
            <em className="not-italic font-semibold text-warm whitespace-nowrap">เหตุผลจริง.</em>
          </span>
          <span className="en-only">
            Not a trust-badge wallpaper.{' '}
            <em className="not-italic font-semibold text-warm whitespace-nowrap">Real reasons.</em>
          </span>
        </h2>

        <div className="mt-12 grid gap-x-12 gap-y-9 md:grid-cols-3">
          <Item
            n="01"
            titleTh="AI ตอบจาก grounded knowledge เท่านั้น"
            titleEn="Strictly grounded AI"
            bodyTh="AI ตอบจากความรู้ที่ทีมคุณยอมรับ (KB + lessons + memory) ไม่ตอบเรื่องที่ไม่เคยอนุมัติ. ทุกข้อความที่ส่งไปลูกค้ามี audit trail."
            bodyEn="Replies are constrained to KB articles, approved lessons, and customer memory the team has signed off on. Nothing improvised. Every outbound message has an audit trail."
          />
          <Item
            n="02"
            titleTh="โครงสร้างที่ผ่านมาตรฐาน"
            titleEn="Enterprise-grade infrastructure"
            bodyTh="Vercel + Supabase บน Singapore region. RLS เปิดทุกตาราง. Encryption at-rest + in-transit. Service-role keys อยู่ใน secret manager เท่านั้น."
            bodyEn="Vercel + Supabase, Singapore region. RLS enabled on every table. Encryption at-rest and in-transit. Service-role keys live only in a secret manager."
          />
          <Item
            n="03"
            titleTh="PDPA + data residency"
            titleEn="PDPA + data residency"
            bodyTh="เลือก residency TH หรือ SG ได้ที่ Pro tier ขึ้นไป. Audit log + retention controls + fact-approval queue สำหรับ memory mode = approval. DPA template พร้อมใช้."
            bodyEn="TH or SG residency on Pro tier and above. Audit log, retention controls, and a fact-approval queue when memory mode is set to 'approval'. Signed DPA template available."
          />
        </div>
      </div>
    </section>
  );
}

function Item({
  n,
  titleTh,
  titleEn,
  bodyTh,
  bodyEn,
}: {
  n: string;
  titleTh: string;
  titleEn: string;
  bodyTh: string;
  bodyEn: string;
}) {
  return (
    <article>
      <p className="font-mono text-[clamp(28px,2.4vw,38px)] font-light leading-none text-warm tabular-nums">
        {n}
      </p>
      <h3 className="mt-4 text-[16px] font-semibold leading-snug text-ink">
        <span className="th-only">{titleTh}</span>
        <span className="en-only">{titleEn}</span>
      </h3>
      <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
        <span className="th-only">{bodyTh}</span>
        <span className="en-only">{bodyEn}</span>
      </p>
    </article>
  );
}
