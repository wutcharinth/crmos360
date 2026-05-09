// All Thai marketing copy lives here. Sourced verbatim from
// crmos360-homepage-demo.html (kept as the canonical IA + copy reference).
// Keep this file flat — components import only what they need.

// ── Channels (hero scene + channel strip) ─────────────────────────────────────
interface Channel { key: string; name: string; count: number; active?: boolean }
export const channels: ReadonlyArray<Channel> = [
  { key: 'line',     name: 'LINE',    count: 8, active: true },
  { key: 'tiktok',   name: 'TikTok',  count: 5 },
  { key: 'shopee',   name: 'Shopee',  count: 4 },
  { key: 'lazada',   name: 'Lazada',  count: 3 },
  { key: 'facebook', name: 'Meta',    count: 6 },
  { key: 'email',    name: 'Email',   count: 2 },
];

export const channelStripBrands = [
  'LINE OA',
  'TikTok Shop',
  'Shopee',
  'Lazada',
  'Facebook',
  'Instagram',
  'Email',
] as const;

// ── Hero conversation list (mock UI) ─────────────────────────────────────────
export type ThreadTag = 'Auto' | 'Review' | 'Escalate' | 'Growth';
interface HeroThread {
  sender: string;
  body: string;
  tag: ThreadTag;
  hot?: boolean;
}
export const heroThreads: ReadonlyArray<HeroThread> = [
  {
    sender: 'คุณพิมพ์พร · LINE OA',
    body: 'ถามเลข tracking ของออเดอร์ล่าสุด ระบบเช็กข้อมูลและตอบได้ทันที',
    tag: 'Auto',
    hot: true,
  },
  {
    sender: 'TikTok Shop Buyer',
    body: 'ลูกค้าขอเปลี่ยนสินค้า AI ร่างคำตอบพร้อมขั้นตอนให้ทีมอนุมัติ',
    tag: 'Review',
  },
  {
    sender: 'Shopee Complaint',
    body: 'ลูกค้าไม่พอใจเรื่องจัดส่งล่าช้า ส่งต่อหัวหน้าทีมพร้อมสรุปเคส',
    tag: 'Escalate',
  },
  {
    sender: 'Instagram Lead',
    body: 'AI แนะนำสินค้าที่เกี่ยวข้องและคูปองสำหรับ follow-up',
    tag: 'Growth',
  },
];

// ── Hero promises ────────────────────────────────────────────────────────────
export const heroPromises = [
  'Auto-Reply แบบควบคุมได้',
  'AI-managed Backoffice',
  'Customer Memory',
  'Marketplace Workflows',
] as const;

// ── AI OS Principles ─────────────────────────────────────────────────────────
export const principles = [
  {
    n: '01',
    title: 'Observe',
    body: 'รวมแชท ออเดอร์ customer profile และ activity จากทุกช่องทางไว้ในมุมมองเดียว',
  },
  {
    n: '02',
    title: 'Understand',
    body: 'AI วิเคราะห์ intent, sentiment, urgency, customer history และ business rules ก่อนแนะนำคำตอบ',
  },
  {
    n: '03',
    title: 'Act',
    body: 'ให้ AI ตอบเอง รออนุมัติ สร้าง ticket เช็กออเดอร์ เรียก API หรือส่งต่อทีมที่เกี่ยวข้อง',
  },
  {
    n: '04',
    title: 'Learn',
    body: 'เรียนรู้จากคำตอบที่ทีมแก้ไข เคสที่ถูก escalate และ lesson ที่ manager อนุมัติ',
  },
] as const;

// ── AI Agents (tabbed) ───────────────────────────────────────────────────────
export type AgentKey = 'service' | 'ops' | 'growth';

export interface AgentSpec {
  key: AgentKey;
  num: string;
  title: string;
  subtitle: string;
  state: string;
  shortLabel: string; // for tab summary
  heading: string;
  description: string;
  capabilities: ReadonlyArray<readonly [string, string]>;
  mini: ReadonlyArray<readonly [string, string]>;
}

export const agents: ReadonlyArray<AgentSpec> = [
  {
    key: 'service',
    num: '01 / Service',
    title: 'Customer Service Agent',
    subtitle: 'AI ตัวหลักสำหรับดูแลลูกค้าทุกช่องทาง',
    state: 'Main Character',
    shortLabel: 'ตัวหลักสำหรับตอบลูกค้า จำบริบท และจัดการเคสประจำวัน',
    heading: 'ตอบลูกค้าเร็วขึ้น โดยยังรักษาคุณภาพและบริบทของแบรนด์',
    description:
      'Customer Service Agent ช่วยตอบคำถาม แนะนำคำตอบ สรุปบทสนทนา วิเคราะห์ intent ตรวจจับ sentiment แปลภาษา จดจำบริบทลูกค้า และแจ้งเตือนเมื่อควรส่งต่อให้มนุษย์',
    capabilities: [
      ['Auto Reply', 'ตอบคำถามที่ปลอดภัยและเกิดซ้ำได้ทันที'],
      ['Approval Draft', 'ร่างคำตอบให้ทีมตรวจในเคสสำคัญ'],
      ['Customer Memory', 'จำประวัติ ความสนใจ และปัญหาเดิม'],
      ['Sentiment & Intent', 'รู้ว่าลูกค้ากำลังถามอะไรและรู้สึกอย่างไร'],
    ],
    mini: [
      ['เหมาะกับ', 'LINE OA, TikTok Shop, Shopee, Lazada, Facebook, Instagram และ Email'],
      ['ตัวอย่างเคส', 'ถามสินค้า โปรโมชั่น ค่าจัดส่ง วิธีชำระเงิน และ complaint เบื้องต้น'],
      ['ผลลัพธ์', 'ลดเวลาตอบซ้ำ ทำให้ agent ใหม่ตอบได้เหมือนคนมีประสบการณ์'],
    ],
  },
  {
    key: 'ops',
    num: '02 / Operations',
    title: 'Operations Agent',
    subtitle: 'AI ที่เปลี่ยนข้อความลูกค้าให้กลายเป็นงานหลังบ้าน',
    state: 'Action Engine',
    shortLabel: 'เชื่อมแชทกับออเดอร์ ticket API workflow และทีมหลังบ้าน',
    heading: 'จากคำถามลูกค้าไปสู่ออเดอร์ ticket API และ workflow',
    description:
      'Operations Agent ช่วยตรวจสอบข้อมูล สร้าง ticket assign งาน เรียก API ส่ง webhook แจ้งทีมภายใน หรือ trigger workflow เมื่อลูกค้าถามเรื่องออเดอร์ การจัดส่ง refund return คูปอง หรือปัญหาหลังการขาย',
    capabilities: [
      ['Order Lookup', 'ตรวจสอบสถานะออเดอร์และเลข tracking'],
      ['Workflow Trigger', 'สร้าง ticket, assign งาน และแจ้งทีม'],
      ['API & Webhook', 'เชื่อมต่อระบบหลังบ้านและ marketplace'],
      ['Return & Refund', 'จัดการขั้นตอนคืนสินค้าและ complaint'],
    ],
    mini: [
      ['เหมาะกับ', 'ทีม support, operation, warehouse และผู้จัดการร้านค้า'],
      ['ตัวอย่างเคส', 'เช็กพัสดุ ขอคืนสินค้า ส่งคูปอง เปลี่ยนที่อยู่ หรือแจ้งปัญหาจัดส่ง'],
      ['ผลลัพธ์', 'AI ไม่ได้แค่ตอบ แต่ช่วยทำงานต่อจากบทสนทนาได้จริง'],
    ],
  },
  {
    key: 'growth',
    num: '03 / Growth',
    title: 'Growth Agent',
    subtitle: 'AI ที่เปลี่ยนบทสนทนาให้เป็นโอกาสทางรายได้',
    state: 'Revenue Intelligence',
    shortLabel: 'แนะนำสินค้า โปรโมชั่น follow-up และ insight เพื่อเพิ่มรายได้',
    heading: 'หาโอกาสขายจากคำถาม ความสนใจ และพฤติกรรมลูกค้า',
    description:
      'Growth Agent วิเคราะห์ความสนใจ คำถามซ้ำ พฤติกรรมลูกค้า และข้อมูลจาก marketplace เพื่อแนะนำสินค้า โปรโมชั่น upsell cross-sell follow-up และ content ที่ควรปรับปรุง',
    capabilities: [
      ['Product Recommendation', 'แนะนำสินค้าที่เหมาะกับบริบทลูกค้า'],
      ['Promotion Suggestion', 'เสนอคูปองหรือโปรโมชันที่มีโอกาสปิดการขาย'],
      ['Follow-up Signal', 'ตรวจจับลูกค้าที่สนใจแต่ยังไม่ซื้อ'],
      ['Content Insight', 'แนะนำ FAQ และ product content ที่ควรเพิ่ม'],
    ],
    mini: [
      ['เหมาะกับ', 'ecommerce, social commerce, marketplace seller และ brand team'],
      ['ตัวอย่างเคส', 'ลูกค้าถามสินค้าซ้ำ เปรียบเทียบรุ่น สนใจแต่ยังไม่จ่าย หรือถามโปรโมชัน'],
      ['ผลลัพธ์', 'ทำให้แชทลูกค้าเป็นแหล่ง insight สำหรับ sales และ marketing'],
    ],
  },
] as const;

// ── Autopilot modes ──────────────────────────────────────────────────────────
interface AutopilotMode {
  title: string;
  label: string;
  body: string;
  bullets: ReadonlyArray<string>;
  highlight?: boolean;
}
export const autopilotModes: ReadonlyArray<AutopilotMode> = [
  {
    title: 'Auto-Reply Mode',
    label: 'High Confidence',
    body: 'สำหรับคำถามที่ปลอดภัย เกิดซ้ำ และข้อมูลครบถ้วน AI สามารถตอบลูกค้าได้ทันทีเพื่อลดเวลารอ',
    bullets: [
      'เวลาเปิดปิดและค่าจัดส่ง',
      'โปรโมชั่นและวิธีชำระเงิน',
      'เช็กสถานะออเดอร์และเลขพัสดุ',
      'FAQ ทั่วไปของสินค้าและบริการ',
    ],
    highlight: true,
  },
  {
    title: 'Approval Mode',
    label: 'Human Review',
    body: 'สำหรับเคสสำคัญ AI จะร่างคำตอบพร้อมเหตุผลให้ทีมตรวจสอบก่อนส่งจริง',
    bullets: [
      'refund, return และ complaint',
      'ลูกค้าไม่พอใจหรือเคส VIP',
      'คำถามที่มีผลต่อยอดขายสูง',
      'policy exception หรือ AI ยังไม่มั่นใจ',
    ],
  },
  {
    title: 'Escalation Mode',
    label: 'Human Care',
    body: 'สำหรับเคสซับซ้อนหรือเสี่ยง AI จะไม่ตอบเอง แต่สรุปบริบทและส่งต่อให้คนที่เหมาะสม',
    bullets: [
      'ข้อพิพาทการชำระเงิน',
      'ลูกค้าขู่รีวิวเสียหาย',
      'ข้อมูลไม่ครบหรือความเสี่ยงด้านแบรนด์',
      'เคสที่ควรให้หัวหน้าทีมดูแล',
    ],
  },
];

// ── Backoffice — Configuration Advisor recommendations + cards ───────────────
export const recommendations = [
  {
    title: 'เปิด Auto Reply สำหรับ tracking request',
    badge: 'auto' as const,
    badgeLabel: '91% confidence',
    body: 'ใน 7 วันที่ผ่านมา ทีมอนุมัติคำตอบประเภทนี้ 124 ครั้ง และแก้ไขน้อยกว่า 3% แนะนำให้เปิด auto-reply เมื่อ order API ส่งข้อมูลครบถ้วน',
    actions: ['Approve', 'Review rule'],
  },
  {
    title: 'เพิ่ม escalation rule สำหรับ complaint จาก Shopee',
    badge: 'review' as const,
    badgeLabel: 'Review',
    body: 'เคส complaint จาก Shopee มี sentiment ลบสูงกว่าช่องทางอื่น 28% แนะนำให้ส่งต่อหัวหน้าทีมเมื่อมีคำว่า "คืนเงิน" หรือ "รีวิว"',
    actions: ['Approve', 'Edit trigger'],
  },
  {
    title: 'เพิ่ม FAQ เรื่องคูปอง TikTok Shop',
    badge: 'neutral' as const,
    badgeLabel: 'Knowledge',
    body: 'ลูกค้าถามเรื่องใช้คูปองไม่ได้ซ้ำ 46 ครั้งในเดือนนี้ แนะนำให้เพิ่ม policy และตัวอย่างคำตอบลง knowledge base',
    actions: ['Add lesson', 'Preview answer'],
  },
] as const;

export const backofficeCards = [
  {
    title: 'AI Setup Assistant',
    body: 'เริ่มต้นจากประเภทธุรกิจ ช่องทางที่ใช้ นโยบายจัดส่ง นโยบายคืนสินค้า tone of voice และ workflow ที่ควรเปิดก่อน',
    bullets: [
      'ไม่ต้องเริ่มจากหน้าจอว่าง',
      'ไม่ต้องเขียน rule ซับซ้อนเองทั้งหมด',
      'เหมาะกับทีมธุรกิจ ไม่ใช่เฉพาะทีมเทคนิค',
    ],
  },
  {
    title: 'AI Workflow Builder จากภาษาคน',
    body: 'บอกระบบด้วยภาษาธรรมชาติ เช่น "ถ้าลูกค้าถามออเดอร์ ให้เช็กสถานะก่อน แล้วตอบพร้อมเลข tracking"',
    bullets: [
      'AI แปลงเป็น workflow ให้ตรวจสอบ',
      'แก้ trigger, condition และ action ได้ก่อนใช้งานจริง',
      'รองรับ API, webhook, ticket และ internal routing',
    ],
  },
  {
    title: 'AI Maintenance',
    body: 'ระบบตรวจจับว่าอะไรควรปรับ เช่น คำตอบที่ agent แก้บ่อย เคสที่ควรเปลี่ยนเป็น auto-reply หรือ policy ที่ควรเพิ่มใน knowledge base',
    bullets: [],
  },
] as const;

// ── Self-improving AI ────────────────────────────────────────────────────────
export const knowledgeBaseItems = [
  'รายละเอียดสินค้า ราคา โปรโมชั่น และ FAQ',
  'นโยบายจัดส่ง คืนสินค้า refund และ marketplace rules',
  'น้ำเสียงของแบรนด์ วิธีรับมือ complaint และ escalation policy',
  'ข้อมูลบริการ แพ็กเกจ คำถามคลินิก หรือคำถามเฉพาะธุรกิจ',
] as const;

export const lessonItems = [
  'ถ้าลูกค้าถามเรื่องส่งช้า ให้ขอโทษก่อน แล้วค่อยแจ้ง tracking',
  'ถ้าสินค้าหมด ให้แนะนำรุ่นใกล้เคียงพร้อมคูปอง',
  'ถ้าลูกค้าขอ refund จาก Shopee ให้ส่งขั้นตอนตาม policy marketplace',
  'ถ้าลูกค้าบ่นซ้ำเกิน 2 ครั้ง ให้ escalate ให้หัวหน้าทีม',
] as const;

// ── Features ─────────────────────────────────────────────────────────────────
export const features = [
  {
    n: '01',
    title: 'Unified Commerce Inbox',
    body: 'รวมข้อความจาก LINE OA, TikTok Shop, Shopee, Lazada, Facebook, Instagram และ Email พร้อม filter, search, unread tracking, assignment และ tags',
  },
  {
    n: '02',
    title: 'AI Customer Memory',
    body: 'จดจำประวัติลูกค้า ความสนใจ sentiment notes tags ปัญหาเดิม และข้อมูลสำคัญจากทุกบทสนทนา',
  },
  {
    n: '03',
    title: 'AI Reply & Auto Reply',
    body: 'ให้ AI ตอบเองในเคสที่มั่นใจ ร่างคำตอบในเคสสำคัญ และส่งต่อทีมเมื่อมีความเสี่ยง',
  },
  {
    n: '04',
    title: 'Order & Workflow Actions',
    body: 'เชื่อม conversation กับ action เช่น เช็กออเดอร์ สร้าง ticket ส่งคูปอง เรียก API หรือแจ้งทีมภายใน',
  },
  {
    n: '05',
    title: 'Growth Suggestions',
    body: 'แนะนำสินค้า โปรโมชั่น follow-up upsell cross-sell และ content ที่ควรปรับปรุงจากคำถามของลูกค้า',
  },
  {
    n: '06',
    title: 'Intelligence Dashboard',
    body: 'มองเห็นคำถามซ้ำ ปัญหาที่เกิดบ่อย sentiment trend เคสที่ควรปรับปรุง และ workflow ที่ควรสร้างเพิ่ม',
  },
] as const;

// ── Outcomes ─────────────────────────────────────────────────────────────────
export const outcomes = [
  {
    title: 'เร็วขึ้น',
    body: 'ลดเวลาตอบคำถามซ้ำและทำให้ทีมดูแลลูกค้าได้มากขึ้นโดยไม่เพิ่มคนตามจำนวนแชทเสมอไป',
  },
  {
    title: 'แม่นขึ้น',
    body: 'ตอบจาก customer memory, knowledge base และ policy ของธุรกิจ ไม่ใช่ template ทั่วไป',
  },
  {
    title: 'คุมได้',
    body: 'เลือกได้ว่าเคสไหนให้ AI ตอบเอง เคสไหนต้องรออนุมัติ และเคสไหนต้องส่งต่อคน',
  },
  {
    title: 'โตได้',
    body: 'ต่อยอดสู่ commerce intelligence ด้าน demand, inventory, pricing, logistics และ supply chain เมื่อเชื่อมข้อมูลครบ',
  },
] as const;

// ── Nav links ────────────────────────────────────────────────────────────────
export const navLinks = [
  { href: '#ai-os', label: 'AI OS' },
  { href: '#agents', label: 'Agents' },
  { href: '#autopilot', label: 'Autopilot' },
  { href: '#backoffice', label: 'Backoffice' },
  { href: '#features', label: 'Features' },
] as const;
