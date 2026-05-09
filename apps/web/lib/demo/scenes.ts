/**
 * Scripted demo scenes for the /demo walkthrough player.
 *
 * Modeled on JongToh's `SCENES` array — but tuned for FlowAIOS's mid-market
 * customer-ops audience (Pim persona). Each scene plays for ~5s, mixes
 * inbound + AI reply + occasional human takeover, and surfaces a "trace"
 * line showing what the AI considered.
 *
 * No LLM cost: this is canned content. The interactive playground at
 * /demo/chat uses real Gemini.
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
  duration: number; // ms
  messages: SceneMessage[];
}

export const DEMO_BRAND = {
  // Canned tenant the demo represents — modeled on Pim's "Sira Studio" persona
  name: 'Sira Studio',
  tagline: 'Mid-tier women\'s fashion · Bangkok',
  team: 'Pim · CS Manager · 9 agents',
};

export const SCENES: Scene[] = [
  {
    id: 'tracking',
    channel: 'line',
    customer: { name: 'พิมพ์ลภัส', handle: 'LINE OA' },
    caption: 'ลูกค้าถามเลข tracking — high confidence, AI ตอบเอง',
    duration: 6000,
    messages: [
      { from: 'customer', body: 'พัสดุถึงไหนแล้วคะ สั่งวันที่ 5' },
      {
        from: 'ai',
        body:
          'สวัสดีค่ะคุณพิมพ์ลภัส 🌿 พัสดุของคุณส่งจาก Kerry แล้วเมื่อวานนี้ คาดว่าถึงพรุ่งนี้ก่อนเที่ยงค่ะ ติดตามได้ที่ EC123456789TH',
        trace: {
          confidence: 0.94,
          tier: 'auto',
          reasoning:
            'High-confidence: Order #3401 found in OMS, shipped 2026-05-08 via Kerry, ETA 2026-05-10.',
          sources: ['kb · tracking template', 'memory · Kerry-preferred shipper'],
        },
      },
      { from: 'customer', body: 'ขอบคุณค่ะ' },
    ],
  },
  {
    id: 'wholesale',
    channel: 'shopee',
    customer: { name: 'Lin Wei' },
    caption: 'Wholesale request on Shopee — medium confidence, draft for human review',
    duration: 7000,
    messages: [
      { from: 'customer', body: 'wholesale 50 pcs price?' },
      {
        from: 'ai',
        body:
          'Draft for review: "Hi! For 50+ pcs wholesale, we offer 28% off retail. Let me know which SKU and I\'ll confirm stock + send a quote 🙏"',
        trace: {
          confidence: 0.71,
          tier: 'approval',
          reasoning:
            'Medium-confidence: matches wholesale-pattern lesson but needs SKU verification before quote. Holding for agent approval.',
          sources: ['lesson · wholesale verify SKU first'],
        },
      },
      { from: 'agent', body: '✓ Approved & sent (Pim)' },
    ],
  },
  {
    id: 'escalate',
    channel: 'instagram',
    customer: { name: '@somchai_real' },
    caption: 'Negative sentiment on IG — auto-escalated to senior agent',
    duration: 7000,
    messages: [
      { from: 'customer', body: 'รอของมา 2 อาทิตย์แล้ว ไม่ตอบเลย จะแจ้งความนะ' },
      {
        from: 'ai',
        body:
          'Escalating to human queue · brief acknowledgment sent: "ขออภัยค่ะ ดิฉันส่งต่อให้หัวหน้าทีมดูแลทันทีค่ะ จะติดต่อกลับใน 15 นาที"',
        trace: {
          confidence: 0.31,
          tier: 'escalate',
          reasoning:
            'Low-confidence + negative sentiment + legal-keyword ("แจ้งความ"). Rule R-007 triggered: escalate to senior agent within 5 min.',
          sources: ['rule · negative sentiment escalation', 'keyword · แจ้งความ'],
        },
      },
      { from: 'agent', body: 'Pim taking over · context loaded · ETA 2 min' },
    ],
  },
  {
    id: 'memory',
    channel: 'line',
    customer: { name: 'อรวรรณ', handle: 'returning customer' },
    caption: 'Customer memory — AI remembers "แพ้ paraben" across all channels',
    duration: 6500,
    messages: [
      { from: 'customer', body: 'มี cleansing balm ตัวใหม่ไหมคะ' },
      {
        from: 'ai',
        body:
          'มีค่ะคุณอรวรรณ — Klin Skin Cleansing Balm v2 (paraben-free, fragrance-free) เปิดตัวสัปดาห์นี้ ราคา ฿890 + ส่ง Kerry ตามปกติค่ะ',
        trace: {
          confidence: 0.92,
          tier: 'auto',
          reasoning:
            'Memory hit: customer profile has "paraben-allergic" + "Kerry-preferred". Recommendation includes both cues automatically.',
          sources: ['memory · paraben allergy', 'memory · Kerry shipper', 'kb · v2 launch FAQ'],
        },
      },
    ],
  },
  {
    id: 'lesson',
    channel: 'tiktok',
    customer: { name: 'TikTok Shop buyer' },
    caption: 'Configuration Advisor watches — proposes a new auto-rule',
    duration: 8000,
    messages: [
      { from: 'customer', body: 'มีโค้ดส่วนลด VIP มั้ยคะ' },
      {
        from: 'ai',
        body:
          'มีค่ะ! สำหรับสมาชิก VIP เดือนนี้: VIP-MAY ลด 15% ขั้นต่ำ ฿1,200 ใช้ได้ถึงสิ้นเดือนค่ะ ✨',
        trace: {
          confidence: 0.91,
          tier: 'auto',
          reasoning:
            'VIP discount-code pattern detected 31× in 30 days. Configuration Advisor will propose this as auto-rule R-008 next sync.',
          sources: ['cluster · VIP discount inquiry (31 hits)', 'memory · returning VIP customer'],
        },
      },
      { from: 'agent', body: 'Advisor · 1 new rule candidate · review tonight' },
    ],
  },
];

export const TOTAL_DURATION = SCENES.reduce((sum, s) => sum + s.duration, 0);
