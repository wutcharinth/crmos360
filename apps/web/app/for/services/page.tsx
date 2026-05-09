import { VerticalLanding } from '@/components/marketing/VerticalLanding';

export const metadata = {
  title: 'FlowAIOS for Services & Education · AI lead-qualifier บน LINE OA',
  description:
    'สำหรับธุรกิจบริการ คลินิก กวดวิชา fitness — AI คัดกรอง lead, ตอบคำถามซ้ำ, ส่งต่อมนุษย์เมื่อจำเป็น. LINE OA + Facebook + Email — ไม่ต้องใช้ Shopee/Lazada.',
};

export default function ServicesLanding() {
  return (
    <VerticalLanding
      kicker="For · Services / Education / Clinic"
      headline="ผู้ปกครองทักถาม"
      headlineEm="AI qualify ก่อน"
      headlineTrail="— ส่งคนต่อเมื่อพร้อมจะจอง"
      lead="ธุรกิจบริการ — คลินิก, กวดวิชา, fitness, real estate — ใช้ LINE OA + Facebook เป็นหลัก. AI คัดกรอง lead, ตอบคำถามซ้ำซาก (เปิดรอบเมื่อไร, ราคาเท่าไร, มีสาขาไหน), ส่งต่อมนุษย์เมื่อต้อง book หรือเป็นเคส clinical. Sheet integration เก็บ catalog/roster ได้เลย."
      primaryCta={{ label: 'เริ่ม trial 14 วัน', href: '/signup' }}
      secondaryCta={{ label: 'ดู PDPA controls', href: '/pricing#enterprise' }}
      channels={['LINE OA', 'Facebook', 'Email']}
      pains={[
        {
          title: 'Manychat รุนแรงเกินไป',
          quote:
            'Lead ใหม่ vs ผู้ปกครองเก่า — สอง flow ต่างกันมาก. Manychat tree rigid — พอ parent ถามนอก flow มันก็พัง. แล้วของฉันอยู่ใน Sheet หมด, มันไม่อ่าน.',
          persona: 'Win · Marketing Manager (tutoring)',
        },
        {
          title: 'After-hours conversion ตก',
          quote:
            'หลัง 8 ทุ่มเรา convert 14% เทียบกับเช้า 33%. Lead เสีย ฿180–280 ต่อ click — เราเสียเงินไปเปล่า.',
          persona: 'Dr. Pong · Clinic chain (5 branches)',
        },
        {
          title: 'Clinical vs non-clinical',
          quote:
            'AI ตอบเรื่องราคาดี — แต่ห้ามตอบเรื่อง diagnosis. ถ้าตอบผิดเรามีปัญหากับ medical practitioner act. ระบบเก่าไม่รู้จัก boundary.',
          persona: 'Dr. Pong · Clinic chain (5 branches)',
        },
      ]}
      features={[
        {
          title: 'Lead qualifier ที่ adapt',
          body: 'AI คัด new vs existing parent อัตโนมัติ. New = qualify + book trial. Existing = look up student/patient context. ไม่ใช่ tree rigid แบบ Manychat — ตอบ off-script ได้.',
        },
        {
          title: 'Configuration Advisor',
          tag: 'รู้ว่าอะไร automate ได้',
          body: 'ทุกสัปดาห์ AI บอกคุณว่า "คำถามนี้ซ้ำ 134 ครั้ง — เปิด auto-reply ได้ไหม?". คุณ approve — มันก็ apply ทันที. ไม่ต้องเดาว่า rule ไหนคุ้ม.',
        },
        {
          title: 'Clinical / boundary rules',
          tag: 'PDPA + Medical Act compliant',
          body: 'Knowledge Base + Lessons เก็บ rule ว่า "AI ห้ามตอบ post-procedure pain — escalate ไป dentist". เป็น hard rule, ไม่หาย, ไม่ลืม. Audit log ทุก action.',
        },
      ]}
      artifact={{ kind: 'lessons', title: 'Configuration Advisor · last 7 days' }}
      metrics={[
        { figure: '+5pp', caption: 'after-hours conversion lift, pilot clinics' },
        { figure: '−47%', caption: 'lead-qualifier handle time, tutoring vertical' },
        { figure: '0', caption: 'clinical-rule violations on AI replies, ever' },
      ]}
      pricingHint={{
        tier: 'Growth tier',
        price: '฿18,000 – ฿35,000 / mo',
        note: 'Sheets integration + multi-channel + Configuration Advisor. Self-serve trial 14 วัน. Enterprise tier (clinic chains): นัด demo.',
      }}
    />
  );
}
