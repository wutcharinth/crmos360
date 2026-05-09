import { VerticalLanding } from '@/components/marketing/VerticalLanding';

export const metadata = {
  title: 'FlowAIOS for Customer Ops · ลด handle time 30% โดยไม่ลดคุณภาพ',
  description:
    'สำหรับทีม CS 5–30 คน. AI draft + human approve + audit log. ลดเวลาตอบ ลด turnover. รวม LINE OA + Shopee + IG + Email ในกล่องเดียว.',
};

export default function CustomerOpsLanding() {
  return (
    <VerticalLanding
      kicker="For · Customer Ops Mid-market"
      headline="AI ร่างคำตอบ"
      headlineEm="ทีมคุณ approve"
      headlineTrail="— Audit log ครบทุก reply"
      lead="ทีมคุณยังคุมแบรนด์ — แต่ AI ตัดงานซ้ำซากออก. Confidence-gated auto-reply, customer memory ที่ portable, audit log สำหรับทุก reply, escalation routing ที่กำหนดได้. ออกแบบสำหรับ COO ที่ต้อง justify spend และ CS manager ที่กลัว turnover."
      primaryCta={{ label: 'นัด demo (Thai live)', href: '/contact' }}
      secondaryCta={{ label: 'ดู audit + PDPA', href: '/pricing#enterprise' }}
      channels={['LINE OA', 'Shopee', 'Lazada', 'Instagram', 'Facebook', 'Email']}
      pains={[
        {
          title: 'Tool เก่าตอบไม่ได้ — ทีมตอบเอง',
          quote:
            'Zaapi เป็นแค่ viewer — agent ของฉันยังพิมพ์เองทุกข้อความ. SLA เราเข้าเป้า แต่คนของฉันลาออก 2 คนใน 3 เดือน. หัวจะระเบิด.',
          persona: 'Pim · CS Manager (35 staff fashion)',
        },
        {
          title: 'Escalation context หาย',
          quote:
            'พอ agent escalate มาที่ฉัน — กว่าจะหาเคสใน Zaapi เจอ context หายไปครึ่งนึงแล้ว. เคสด่วนเสีย customer trust ก่อนทีมจะเข้าถึงด้วยซ้ำ.',
          persona: 'Pim · CS Manager (35 staff fashion)',
        },
        {
          title: 'COO ต้องเห็นว่าคุ้ม',
          quote:
            'ถ้าจะเปลี่ยนเครื่องมือ ฉันต้อง show ว่า handle time ลด ≥30% ไม่งั้น Khun Anucha ไม่อนุมัติ. ต้องเป็น measurable ภายใน 30 วัน.',
          persona: 'Pim · CS Manager (35 staff fashion)',
        },
      ]}
      features={[
        {
          title: 'Confidence-gated auto-reply',
          tag: 'Strongest signal in study',
          body: 'AI replies on >90% confidence, drafts on 70-90%, escalates on <70%. ทีมคุณยังเป็นคนตัดสินใจ — แต่ไม่ต้องพิมพ์ตั้งแต่ศูนย์. Handle time ลดเฉลี่ย 32% ใน pilot.',
        },
        {
          title: 'Knowledge Base + Auto-Lessons',
          tag: 'Top-rated planned feature',
          body: 'AI เห็นทีมแก้ draft ของมันยังไง — แล้วเสนอเป็น lesson ให้คุณ approve. กลายเป็น rule ที่ AI ใช้ในเคสคล้ายกัน. ทีมไม่ต้องสอน AI ซ้ำ — มันสังเกตเอง.',
        },
        {
          title: 'Intelligence Dashboard',
          tag: 'Coming with M1.5',
          body: 'รู้ว่าคำถามอะไรซ้ำ, sentiment ตกตอนไหน, ทีมไหนรับโหลดเกิน. "Automate next" widget เสนอ rule candidate ให้ approve — ไม่ต้องเดา.',
        },
      ]}
      artifact={{ kind: 'inbox', title: 'Inbox · 3 of 1,800 conversations today' }}
      metrics={[
        { figure: '−32%', caption: 'handle time, average across pilot teams' },
        { figure: '฿66k/mo', caption: 'headcount budget freed, equivalent of 3 FTE' },
        { figure: '30d', caption: 'to measurable handle-time lift, pilot criterion' },
      ]}
      pricingHint={{
        tier: 'Pro tier',
        price: '฿35,000 – ฿95,000 / mo',
        note: 'รวม Pro features + Configuration Advisor + audit log + multi-branch + Thai live support. Pilot 30 วัน with success metric.',
      }}
    />
  );
}
