/**
 * Scripted demo scenes for the /demo walkthrough player.
 *
 * Each scene plays for ~14–18s, with longer back-and-forth threads
 * (5–7 messages per scenario) and a deliberate pause at the end
 * before transitioning to the next scene. The interactive playground
 * at /demo also runs on this same page using real Gemini.
 */

export type SceneChannel = 'line' | 'shopee' | 'tiktok' | 'instagram' | 'lazada' | 'email';
export type ConfidenceTier = 'auto' | 'approval' | 'escalate';

export interface SceneMessage {
  from: 'customer' | 'ai' | 'agent';
  body: string;
  /** present on AI messages — informs the bot-trace panel */
  trace?: {
    confidence: number;
    tier: ConfidenceTier;
    reasoning: string;
    sources?: string[]; // KB or memory snippets the AI used
  };
}

export interface Scene {
  id: string;
  channel: SceneChannel;
  customer: { name: string; handle?: string };
  caption: string; // narrator caption above the player
  duration: number; // ms — distributed across messages, plus pause at the end
  messages: SceneMessage[];
}

export const DEMO_BRAND = {
  name: 'Sira Studio',
  tagline: "Mid-tier women's fashion · Bangkok",
  team: 'Pim · CS Manager · 9 agents',
};

export const SCENES: Scene[] = [
  {
    id: 'tracking',
    channel: 'line',
    customer: { name: 'พิมพ์ลภัส', handle: 'LINE OA' },
    caption: 'ลูกค้าถามเลข tracking — high confidence, AI ตอบเอง',
    duration: 16000,
    messages: [
      { from: 'customer', body: 'พัสดุถึงไหนแล้วคะ สั่งวันที่ 5' },
      {
        from: 'ai',
        body:
          'สวัสดีค่ะคุณพิมพ์ลภัส 🌿 พัสดุของคุณ Order #3401 ส่งจาก Kerry แล้วเมื่อวานนี้ค่ะ\nคาดว่าถึงพรุ่งนี้ก่อนเที่ยง · เลข tracking: EC123456789TH',
        trace: {
          confidence: 0.94,
          tier: 'auto',
          reasoning:
            'Order #3401 found in OMS, shipped 2026-05-08 via Kerry, ETA 2026-05-10. Customer has Kerry-preferred tag.',
          sources: ['kb · tracking template', 'memory · Kerry-preferred shipper'],
        },
      },
      { from: 'customer', body: 'ขอบคุณมากค่ะ แล้วถ้าไม่อยู่บ้านส่งให้เพื่อนบ้านได้ไหม' },
      {
        from: 'ai',
        body:
          'ได้ค่ะ 😊 Kerry รองรับการเซ็นรับแทนของผู้ที่อยู่ในบริเวณเดียวกัน\nหรือถ้าสะดวก สามารถนัดส่งซ้ำผ่าน Kerry app · พิมพ์เลข tracking ด้านบนได้เลยค่ะ',
        trace: {
          confidence: 0.91,
          tier: 'auto',
          reasoning:
            'Standard Kerry redelivery policy. Direct quote from KB · no escalation needed.',
          sources: ['kb · Kerry delivery options', 'kb · neighbor signature policy'],
        },
      },
      { from: 'customer', body: 'โอเคเลยค่ะ ขอบคุณนะคะ ☺️' },
      {
        from: 'ai',
        body:
          'ยินดีค่ะคุณพิมพ์ลภัส · มีอะไรเพิ่มเติมแจ้งได้ตลอดนะคะ 💚',
        trace: {
          confidence: 0.96,
          tier: 'auto',
          reasoning: 'Closing courtesy reply — pattern matches "thanks" in 2.1k prior conversations.',
          sources: ['kb · sign-off template'],
        },
      },
    ],
  },
  {
    id: 'wholesale',
    channel: 'shopee',
    customer: { name: 'Lin Wei' },
    caption: 'Wholesale request on Shopee — medium confidence, draft for human review',
    duration: 18000,
    messages: [
      {
        from: 'customer',
        body: "Hi! I want to order 50 pcs of your linen camisole for my SG store. What's the wholesale price?",
      },
      {
        from: 'ai',
        body:
          '⏸ Drafted for review · holding for agent approval\n\n"Hi Lin! Thanks for reaching out 🙏 For 50+ pcs wholesale we offer 28% off retail. Could you share the SKU and your preferred colorway? I\'ll confirm stock and send a quote with shipping options to SG."',
        trace: {
          confidence: 0.71,
          tier: 'approval',
          reasoning:
            'Matches wholesale-pattern lesson (lifted from 14 prior approved threads). Needs SKU verification before quote — holding for agent review per rule R-013.',
          sources: ['lesson · wholesale verify SKU first', 'rule R-013 · cross-border quote'],
        },
      },
      { from: 'agent', body: '✓ Approved & sent (Pim · 12:42)' },
      {
        from: 'customer',
        body: 'SKU is LC-2024-OAT in size M. I need them by end of June. Stock ok?',
      },
      {
        from: 'ai',
        body:
          'พร้อมค่ะ 👍 LC-2024-OAT ในไซส์ M เหลืออยู่ 67 ตัวค่ะ\n\nQuote 50 ชิ้น × ฿420 (after 28% wholesale) = ฿21,000\nShipping to SG: DHL ~฿850 · ETA 4–6 days\n\nต้องการ proforma invoice ส่งไปที่อีเมลไหนคะ?',
        trace: {
          confidence: 0.88,
          tier: 'auto',
          reasoning:
            'SKU confirmed, stock checked, pricing matrix applied. Confidence raised post-approval since data is now verified.',
          sources: ['oms · stock check', 'kb · DHL SG rates', 'lesson · PI workflow'],
        },
      },
      { from: 'customer', body: 'lin@studio.sg please. Can you also throw in 5 extra in cream?' },
      { from: 'agent', body: 'Pim handling negotiation · auto-PI sending after agent confirms terms' },
    ],
  },
  {
    id: 'escalate',
    channel: 'instagram',
    customer: { name: '@somchai_real' },
    caption: 'Negative sentiment on IG — auto-escalated to senior agent',
    duration: 17000,
    messages: [
      { from: 'customer', body: 'รอของมา 2 อาทิตย์แล้ว ไม่ตอบเลย จะแจ้งความนะ!!' },
      {
        from: 'ai',
        body:
          '⚠️ Escalating to senior queue · sending brief acknowledgment\n\n"ขออภัยมากค่ะคุณ ดิฉันส่งต่อให้หัวหน้าทีมดูแลทันทีค่ะ จะติดต่อกลับภายใน 15 นาที พร้อมข้อมูลที่ตรวจสอบแล้ว 🙏"',
        trace: {
          confidence: 0.31,
          tier: 'escalate',
          reasoning:
            'Low-confidence + negative sentiment + legal-keyword ("แจ้งความ") + 14-day age. Rule R-007 triggered: senior agent within 5 min, full thread context loaded.',
          sources: ['rule R-007 · legal keyword escalation', 'sentiment · -0.78', 'order #2891 · stuck in transit'],
        },
      },
      { from: 'agent', body: 'Pim taking over · context loaded · order #2891 stuck at hub since May 6' },
      {
        from: 'agent',
        body:
          'สวัสดีค่ะคุณสมชาย ดิฉันชื่อพิมค่ะ ขออนุญาตดูแลเคสของคุณนะคะ ขอโทษเป็นอย่างสูงสำหรับความล่าช้านี้ค่ะ\n\nได้ตรวจสอบแล้ว · order #2891 ติดค้างที่ศูนย์กระจายสินค้า Kerry ตั้งแต่วันที่ 6 พ.ค. ดิฉันขอเสนอ:\n\n1) ส่งใหม่ด่วน Express ฟรี (ถึงพรุ่งนี้)\n2) คืนเงินเต็มจำนวน + ส่ง voucher ฿500 ขอโทษ',
      },
      { from: 'customer', body: 'งั้นเอาแบบที่ 1 ค่ะ ขอบคุณที่ติดต่อกลับมาเร็วนะคะ' },
      {
        from: 'agent',
        body:
          'รับทราบค่ะคุณสมชาย ดิฉันจัดส่งใหม่ Express ให้ทันที 📦\nเลข tracking ใหม่จะส่งให้ภายใน 1 ชม. และ voucher ฿500 ขอโทษเป็นเสริมให้ด้วยค่ะ ขอบคุณที่ให้โอกาสปรับปรุงนะคะ 🙏',
      },
      { from: 'customer', body: 'ขอบคุณค่ะ จริงใจมาก' },
    ],
  },
  {
    id: 'memory',
    channel: 'line',
    customer: { name: 'อรวรรณ', handle: 'returning customer · LINE' },
    caption: 'Customer memory — AI remembers "แพ้ paraben" across all channels',
    duration: 16000,
    messages: [
      { from: 'customer', body: 'มี cleansing balm ตัวใหม่ไหมคะ' },
      {
        from: 'ai',
        body:
          'มีค่ะคุณอรวรรณ 🌿\n\nKlin Skin Cleansing Balm v2 (paraben-free, fragrance-free) เพิ่งเปิดตัวสัปดาห์นี้ค่ะ\nราคา ฿890 · ส่ง Kerry ตามปกติ · เนื้อนุ่มกว่าเดิม คงสูตร paraben-free ไว้ตามที่คุณเคยแจ้งค่ะ',
        trace: {
          confidence: 0.92,
          tier: 'auto',
          reasoning:
            'Memory hit (3 facts): paraben-allergic, Kerry-preferred, returning skincare buyer (5 prior orders). Recommendation includes all cues automatically.',
          sources: ['memory · paraben allergy', 'memory · Kerry shipper', 'memory · 5 prior orders', 'kb · v2 launch FAQ'],
        },
      },
      { from: 'customer', body: 'ใช้กับ retinol ที่กินอยู่ได้ไหมคะ' },
      {
        from: 'ai',
        body:
          'ได้ค่ะ ✨ Cleansing balm นี้ไม่มีกรดและน้ำหอม ใช้คู่กับ retinol topical ได้เลย\n\nแนะนำว่าหลังล้างให้บำรุง moisturizer ก่อนใช้ retinol นะคะ และเลี่ยง vitamin C ในเช้าเดียวกันถ้าใหม่ต่อ retinol ค่ะ',
        trace: {
          confidence: 0.86,
          tier: 'auto',
          reasoning:
            'Skincare-compatibility KB query · matched against 8 routine articles. No interactions flagged.',
          sources: ['kb · retinol routine guide', 'kb · ingredient compatibility chart'],
        },
      },
      { from: 'customer', body: 'เก็บไว้ใน cart ละนะคะ มี travel size ไหม' },
      {
        from: 'ai',
        body:
          'มีค่ะ! Travel size 30g ราคา ฿320 · เพิ่งเข้ามาในไลน์เดือนนี้\nเก็บไว้ใน cart ของคุณแล้วค่ะ 🎁 ใช้โค้ด REPEAT15 ลด 15% สำหรับลูกค้าซื้อซ้ำได้นะคะ',
        trace: {
          confidence: 0.95,
          tier: 'auto',
          reasoning:
            'Customer matches "returning · 5+ orders" tier · auto-applies REPEAT15 per loyalty rule R-019.',
          sources: ['rule R-019 · returning loyalty discount', 'oms · travel-size SKU'],
        },
      },
      { from: 'customer', body: 'ขอบคุณค่ะ น่ารักมาก ☺️' },
    ],
  },
  {
    id: 'lesson',
    channel: 'tiktok',
    customer: { name: 'TikTok Shop buyer' },
    caption: 'Configuration Advisor watches — proposes a new auto-rule from a trending question',
    duration: 18000,
    messages: [
      { from: 'customer', body: 'มีโค้ดส่วนลด VIP มั้ยคะ เห็นในไลฟ์เมื่อกี้' },
      {
        from: 'ai',
        body:
          'มีค่ะ! 🎉 สำหรับสมาชิก VIP เดือนนี้:\n\nVIP-MAY · ลด 15% ขั้นต่ำ ฿1,200\nใช้ได้ถึงสิ้นเดือน · ใช้ได้ทุก SKU ยกเว้น collab limited',
        trace: {
          confidence: 0.91,
          tier: 'auto',
          reasoning:
            'VIP discount-code pattern detected 31× in last 30 days. Configuration Advisor will propose this as auto-rule R-008 next sync.',
          sources: ['cluster · VIP discount inquiry (31 hits)', 'memory · returning VIP customer'],
        },
      },
      { from: 'customer', body: 'ใช้ได้กับสินค้าใน Live ที่กำลังขายอยู่มั้ยคะ' },
      {
        from: 'ai',
        body:
          'ใช้ได้ค่ะ 💜 ทั้ง stream ปกติและ flash ของ Live tonight ใช้โค้ดได้เลย\nกด apply VIP-MAY ตอน checkout · ระบบจะหักให้อัตโนมัติค่ะ',
        trace: {
          confidence: 0.89,
          tier: 'auto',
          reasoning:
            'TikTok Shop live-stream coupon eligibility — direct policy match.',
          sources: ['kb · TikTok Live coupon policy'],
        },
      },
      { from: 'agent', body: '🔔 Advisor · "VIP code on TikTok" cluster reached 31 hits — 1 new rule candidate ready for review tonight' },
      { from: 'customer', body: 'ขอบคุณค่ะ พึ่งสมัคร VIP เมื่อสัปดาห์ก่อน รู้สึกดีจังที่ได้ใช้' },
      {
        from: 'ai',
        body:
          'ยินดีต้อนรับสู่ VIP ค่ะ 🌟 ขอให้ช้อปสนุกนะคะ\nถ้ามีคำถามเรื่องสินค้าหรือ size · ทักได้ตลอด 24 ชม. ค่ะ',
        trace: {
          confidence: 0.94,
          tier: 'auto',
          reasoning:
            'New-VIP welcome pattern · auto-reply with brand-tone closing.',
          sources: ['kb · VIP welcome template'],
        },
      },
    ],
  },
];

export const TOTAL_DURATION = SCENES.reduce((sum, s) => sum + s.duration, 0);
