import { VerticalLanding } from '@/components/marketing/VerticalLanding';

export const metadata = {
  title: 'FlowAIOS for DTC Commerce · LINE OA + Shopee + TikTok ที่เดียว',
  description:
    'AI ตอบลูกค้าเอง — เมื่อมั่นใจ. ส่งให้คุณรีวิว — เมื่อต้องระวัง. รวม LINE OA, Shopee, TikTok Shop, Lazada, IG ในกล่องเดียว — สำหรับ DTC commerce ในไทย.',
};

export default function CommerceLanding() {
  return (
    <VerticalLanding
      kicker="For · DTC Commerce"
      headline="ลูกค้าถามตอนตีสอง"
      headlineEm="AI ตอบเองได้"
      headlineTrail="— ส่งดราฟต์ให้คุณ approve จากมือถือตอนเช้า"
      lead="กล่องข้อความเดียวสำหรับ LINE OA, Shopee, TikTok Shop, Lazada และ Instagram. AI ตอบคำถามซ้ำๆ ที่มั่นใจสูง ส่งดราฟต์ให้คุณ approve เมื่อต้องคิด ส่งต่อทีมเมื่อเป็นเคสยาก. เริ่มเห็นผลใน 7 วัน — ไม่ต้องโทรขายคุณ."
      primaryCta={{ label: 'เริ่ม trial 14 วัน', href: '/signup' }}
      secondaryCta={{ label: 'ดู demo', href: '/#hero' }}
      channels={['LINE OA', 'Shopee', 'TikTok Shop', 'Lazada', 'Instagram', 'Facebook']}
      pains={[
        {
          title: 'Tab toggling ทั้งวัน',
          quote:
            'ทุกเช้าพี่เปิด LINE OA, Shopee Centre, TikTok Shop และ Sheet พร้อมกัน 4 tab. 11 โมงตอบคำถามเดิมไปยี่สิบครั้งใน 3 หน้าจอ — ลูกค้าคนเดียวกันด้วย เพราะรอตอบที่แรกไม่ไหว.',
          persona: 'Nat · DTC Beauty (Bangkok)',
        },
        {
          title: 'Manychat ตอบไม่ได้นอก script',
          quote:
            'พอลูกค้าถามนอก flow มันก็โยนกลับมาว่า "รอ admin ตอบนะคะ" — รอ 40 นาที. SLA เราคือ 5 นาที. หลังเลิกงานนี่เราเสีย order ทุกวัน.',
          persona: 'Nat · DTC Beauty (Bangkok)',
        },
        {
          title: 'Wholesale ที่ Sheet ไม่รู้',
          quote:
            'มีลูกค้าทักมาขอซื้อส่ง 50 ชิ้น ไม่ได้ตามใน Sheet. กว่าจะตอบราคาที่ถูกต้องได้ ลูกค้าหายไปแล้ว.',
          persona: 'อรวรรณ · ecom mid-tier',
        },
      ]}
      features={[
        {
          title: 'Confidence-gated auto-reply',
          tag: 'Validated 8/8 personas',
          body: 'AI ตอบเองเมื่อมั่นใจ >90%. ส่งดราฟต์ให้ approve เมื่อ 70-90%. ส่งต่อคนทันทีเมื่อต่ำกว่านั้น. คุณกำหนด threshold ได้ — และเห็น confidence ของทุก reply.',
        },
        {
          title: 'Customer Memory ทุกแชนเนล',
          tag: 'แพ้อะไร · ชอบอะไร · เคยซื้ออะไร',
          body: 'AI จำว่าลูกค้าคนนี้แพ้ paraben, ส่ง Kerry, AOV ฿890. ลูกค้ากลับมาเมื่อไรในแชนเนลไหน — context พร้อม. ไม่ต้องอ่านแชทเก่าทุกครั้ง.',
        },
        {
          title: 'Order lookup teaser',
          tag: 'M1.6 (Shipnity + Shopee)',
          body: 'AI เช็ค tracking, สถานะ order, สต็อก SKU จากระบบหลังบ้านเอง — แล้วตอบลูกค้าได้ทันที. ลด tab toggle เกือบหมด.',
        },
      ]}
      artifact={{ kind: 'confidence', title: 'Confidence-gated reply · live' }}
      metrics={[
        { figure: '38', caption: 'drafts approved per night, avg solo founder' },
        { figure: '+41%', caption: 'after-hours conversion lift, pilot brands' },
        { figure: '< 7d', caption: 'time to first value on self-serve trial' },
      ]}
      pricingHint={{
        tier: 'Growth tier',
        price: '฿8,000 – ฿24,000 / mo',
        note: 'รวม unified inbox + AI auto-reply + memory + dashboard. Self-serve trial 14 วัน ไม่ต้องใส่บัตรเครดิต.',
      }}
    />
  );
}
