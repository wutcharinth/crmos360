/**
 * Interactive demo scenarios — 5 ecommerce category playgrounds.
 *
 * Each scenario boots a fictional brand store with its own catalog facts
 * and policies, then highlights a distinct AI capability that's hard to
 * deliver without context-aware retail tooling:
 *
 *   beauty       Customer memory + ingredient compatibility
 *   fashion      Stock check + size matrix + alternative cross-sell
 *   food         Real-time order tracking + mid-cook modification
 *   electronics  Spec comparison + warranty Q&A + upgrade-path advice
 *   supplements  Compliance boundary — knowing what NOT to answer
 *
 * The system prompt for each is loaded server-side by /api/demo/scenario,
 * so brand facts (SKU, prices, KB) never bloat the client bundle.
 */

export type ScenarioId =
  | 'beauty'
  | 'fashion'
  | 'food'
  | 'electronics'
  | 'supplements'
  | 'hotel'
  | 'education'
  | 'realestate'
  | 'fitness';

/** Icon glyph identifiers — render via the CategoryIcon component. */
export type CategoryIconKey =
  | 'sparkles'
  | 'shirt'
  | 'bowl'
  | 'monitor'
  | 'leaf'
  | 'bed'
  | 'book'
  | 'home'
  | 'dumbbell';

export interface ScenarioMeta {
  id: ScenarioId;
  icon: CategoryIconKey;
  category: { th: string; en: string };
  brand: string;
  tagline: { th: string; en: string };
  capability: { th: string; en: string };
  greeting: { th: string; en: string };
  starters: ReadonlyArray<{ th: string; en: string }>;
}

export const SCENARIOS: ReadonlyArray<ScenarioMeta> = [
  {
    id: 'beauty',
    icon: 'sparkles',
    category: { th: 'Beauty / Skincare', en: 'Beauty / Skincare' },
    brand: 'Klin Skin',
    tagline: {
      th: 'สกินแคร์สำหรับผิวบอบบาง',
      en: 'Skincare for sensitive skin',
    },
    capability: {
      th: 'AI จำข้อมูลแพ้ของลูกค้า + ตรวจ ingredient ก่อนแนะนำ',
      en: 'AI remembers allergies + checks ingredient compatibility before recommending',
    },
    greeting: {
      th: 'สวัสดีค่ะ ยินดีต้อนรับสู่ Klin Skin คุณลูกค้าเคยซื้อ Cleansing Balm Original เดือนที่แล้ว วันนี้มีอะไรให้ช่วยไหมคะ ถามเรื่องส่วนผสมหรือผลิตภัณฑ์อื่นได้เลยค่ะ',
      en: "Hi! Welcome back to Klin Skin. You bought Cleansing Balm Original last month — happy to help with ingredient questions, allergies, or recommend something new today.",
    },
    starters: [
      {
        th: 'ฉันแพ้ paraben — ใช้ Cleansing Balm v2 ได้ไหมคะ',
        en: "I'm allergic to paraben — can I use Cleansing Balm v2?",
      },
      {
        th: 'กินวิตามิน A อยู่ ใช้ retinol cream ตัวนี้คู่กันได้ไหม',
        en: "I take vitamin A — is your retinol cream safe alongside it?",
      },
      {
        th: 'ผิวมัน ผสมแห้ง อายุ 28 แนะนำ moisturizer ตัวไหน',
        en: 'Combo oily-dry skin, age 28 — what moisturizer would you suggest?',
      },
    ],
  },
  {
    id: 'fashion',
    icon: 'shirt',
    category: { th: 'Fashion', en: 'Fashion' },
    brand: 'Sira Studio',
    tagline: {
      th: 'แฟชั่นผู้หญิง · Made in Bangkok',
      en: "Women's fashion · Made in Bangkok",
    },
    capability: {
      th: 'AI เช็คสต็อก + size matrix + แนะนำตัวอื่นเมื่อหมด',
      en: 'AI checks live stock + size matrix + cross-sells alternatives when sold out',
    },
    greeting: {
      th: 'สวัสดีค่ะ Sira Studio มาเช็คไอเทมตัวไหนคะ พิมพ์ SKU หรือชื่อรุ่นมาได้เลย หรือบอกสไตล์ที่ต้องการให้ดิฉันแนะนำได้ค่ะ',
      en: 'Welcome to Sira Studio. Looking for a specific item? Drop the SKU or item name, or describe the style you have in mind and I can recommend.',
    },
    starters: [
      {
        th: 'มี linen blazer สี oat ไซส์ M ไหมคะ',
        en: 'Do you have the linen blazer in oat color, size M?',
      },
      {
        th: 'ส่ง Bangkok กี่วัน ส่ง Chiang Mai กี่วัน',
        en: 'How long does delivery take to Bangkok vs Chiang Mai?',
      },
      {
        th: 'นโยบายคืนสินค้าเป็นยังไงคะ ไม่พอดีไซส์',
        en: "What's the return policy if the size doesn't fit?",
      },
    ],
  },
  {
    id: 'food',
    icon: 'bowl',
    category: { th: 'Food / Delivery', en: 'Food / Delivery' },
    brand: 'Krua Mae',
    tagline: {
      th: 'อาหารไทยส่งถึงที่ · 14 สาขา',
      en: 'Thai home cooking, delivered · 14 branches',
    },
    capability: {
      th: 'AI ดูสถานะออเดอร์ real-time + รับการแก้ไขก่อนของออกครัว',
      en: 'AI tracks order status real-time + accepts modifications before kitchen-out',
    },
    greeting: {
      th: 'สวัสดีค่ะ Krua Mae มีออเดอร์ที่อยากเช็คหรือสาขาที่อยากสั่งไหมคะ ส่งเลขออเดอร์มาได้เลย หรือบอกพิกัดให้ดิฉันแนะนำสาขาใกล้ที่สุดได้ค่ะ',
      en: 'Hi from Krua Mae. Order to track or modify? Drop the order number — or share your area and I can suggest the nearest branch.',
    },
    starters: [
      {
        th: 'ออเดอร์ #3401 ถึงไหนแล้วคะ',
        en: 'Where is order #3401 right now?',
      },
      {
        th: 'ขอเปลี่ยนข้าวผัดให้ไม่เผ็ดได้ไหมคะ ออเดอร์ #3402',
        en: 'Can I change order #3402 to mild spice level?',
      },
      {
        th: 'สาขาทองหล่อปิดกี่โมง ยังสั่งทันไหม',
        en: 'What time does Thonglor branch close? Can I still order?',
      },
    ],
  },
  {
    id: 'electronics',
    icon: 'monitor',
    category: { th: 'Electronics', en: 'Electronics' },
    brand: 'Volt Hub',
    tagline: {
      th: 'อุปกรณ์ไอที + กล้อง · authorized reseller',
      en: 'Computers, cameras, audio · authorized reseller',
    },
    capability: {
      th: 'AI เปรียบเทียบสเปก + ตอบเรื่อง warranty + แนะนำ upgrade path',
      en: 'AI compares specs + answers warranty + recommends an upgrade path',
    },
    greeting: {
      th: 'สวัสดีครับ Volt Hub ถามเรื่องสเปก, ประกัน, หรือ trade-in ได้เลยครับ บอกการใช้งานหลักของเครื่องมา ผมจะแนะนำตัวที่คุ้มที่สุดให้ครับ',
      en: 'Welcome to Volt Hub. Ask about specs, warranty, or trade-in. Tell me the main use case for the gear and I can point you to the best-value pick.',
    },
    starters: [
      {
        th: 'iPad Air vs iPad Pro M4 ทำงาน design ตัวไหนคุ้มกว่า',
        en: 'iPad Air vs iPad Pro M4 — which is better value for design work?',
      },
      {
        th: 'ประกัน MacBook ครอบคลุมการตกน้ำไหมครับ',
        en: 'Does my MacBook warranty cover water damage?',
      },
      {
        th: 'มี trade-in iPhone 13 Pro ไป iPhone 15 ได้ไหม ราคาประมาณเท่าไร',
        en: 'Can I trade in iPhone 13 Pro for iPhone 15? Rough price estimate?',
      },
    ],
  },
  {
    id: 'hotel',
    icon: 'bed',
    category: { th: 'Hotel / Travel', en: 'Hotel / Travel' },
    brand: 'Baan Sukhum Boutique',
    tagline: {
      th: 'บูทีคโฮเทล 24 ห้อง · สุขุมวิท ซอย 11',
      en: '24-room boutique hotel · Sukhumvit Soi 11',
    },
    capability: {
      th: 'AI เช็คห้องว่าง, รับ booking, จำ preference ของแขกประจำ',
      en: 'AI checks live availability, takes bookings, remembers preferences for returning guests',
    },
    greeting: {
      th: 'สวัสดีค่ะ Baan Sukhum Boutique อยากเช็คห้องว่างหรือสอบถามเรื่อง booking ที่จองไว้ไหมคะ บอกวันที่ที่จะเข้าพักได้เลย หรือบอกเลข booking มาเช็คให้ค่ะ',
      en: 'Welcome to Baan Sukhum Boutique. Looking for a room, or have a booking to check? Share your dates or booking number and I can help.',
    },
    starters: [
      {
        th: 'ห้องว่าง 14-16 พ.ค. สำหรับ 2 คน มีไหมคะ',
        en: 'Any rooms for 2 people, May 14-16?',
      },
      {
        th: 'จะเช็คอินตี 1 ทุ่ม booking #B5021 จะมาช้าหน่อยได้ไหมครับ',
        en: 'Late check-in around 7pm for booking #B5021 — possible?',
      },
      {
        th: 'มีรถรับสนามบินไหม สุวรรณภูมิ',
        en: 'Airport pickup from Suvarnabhumi available?',
      },
    ],
  },
  {
    id: 'education',
    icon: 'book',
    category: { th: 'Education / Tutoring', en: 'Education / Tutoring' },
    brand: 'Lumina Learning',
    tagline: {
      th: 'โรงเรียนกวดวิชา · IELTS · TOEFL · SAT',
      en: 'Test prep tutoring · IELTS · TOEFL · SAT',
    },
    capability: {
      th: 'AI แนะนำ course ตามเป้าคะแนน, ตอบเรื่องตารางสอน, ส่งต่อเรื่องราคาให้ที่ปรึกษา',
      en: 'AI matches courses to target scores, answers schedule questions, escalates pricing/contracts to advisors',
    },
    greeting: {
      th: 'สวัสดีค่ะ Lumina Learning อยากเตรียมสอบอะไรคะ บอกเป้าคะแนนและเวลาที่มีให้ดิฉันแนะนำคอร์สที่เหมาะที่สุดได้ค่ะ คำถามเรื่องราคา promotion ส่งต่อให้ที่ปรึกษานะคะ',
      en: 'Hi from Lumina Learning. What are you preparing for? Tell me your target score and timeline — I can match you to the right course. Pricing and promotions go through our advisors.',
    },
    starters: [
      {
        th: 'อยากได้ IELTS 7.5 ใน 3 เดือน เริ่มจากไหนคะ',
        en: 'Want IELTS 7.5 in 3 months — where do I start?',
      },
      {
        th: 'คอร์ส SAT รอบเช้า เสาร์-อาทิตย์ มีไหมคะ',
        en: 'Any SAT classes on weekend mornings?',
      },
      {
        th: 'เคยเรียน TOEFL ที่อื่นแล้ว ทำ placement test ที่นี่ได้ไหม',
        en: 'I studied TOEFL elsewhere — can I do a placement test here?',
      },
    ],
  },
  {
    id: 'realestate',
    icon: 'home',
    category: { th: 'Real Estate', en: 'Real Estate' },
    brand: 'Habitate',
    tagline: {
      th: 'นายหน้าอสังหาฯ · คอนโด + บ้าน กรุงเทพ',
      en: 'Bangkok property brokerage · condos + houses',
    },
    capability: {
      th: 'AI แนะนำ unit ตาม budget, ตอบเรื่องทำเล, นัดเข้าชมให้นายหน้า',
      en: 'AI matches units to budget, answers neighborhood questions, schedules viewings with the broker',
    },
    greeting: {
      th: 'สวัสดีครับ Habitate มองหาคอนโดหรือบ้านโซนไหนครับ บอก budget และทำเลที่สนใจ ผมจะดูยูนิตที่ตรงให้ การ negotiate ราคาและสัญญาส่งต่อให้นายหน้าเลยครับ',
      en: 'Hi from Habitate. Looking for a condo or house? Share budget and area and I can pull matching units. Price negotiation + contracts go through our broker.',
    },
    starters: [
      {
        th: '1-bed คอนโด BTS Asoke ราคาไม่เกิน 15 ล้าน มีไหมครับ',
        en: '1-bed condo near BTS Asoke under 15M — what do you have?',
      },
      {
        th: 'อยากดู Q4 Sukhumvit 36 ใน 3 ห้องที่มี ขอดูสัปดาห์นี้ได้ไหม',
        en: 'Can I tour 3 units at Q4 Sukhumvit 36 this week?',
      },
      {
        th: 'ค่าโอน + ค่าธรรมเนียมทั่วไปประมาณกี่เปอร์เซ็นต์ของราคาขายครับ',
        en: 'Roughly what % of sale price are transfer fees + closing costs?',
      },
    ],
  },
  {
    id: 'fitness',
    icon: 'dumbbell',
    category: { th: 'Fitness / Wellness', en: 'Fitness / Wellness' },
    brand: 'Pulse Studio',
    tagline: {
      th: 'พิลาทิส + ฟังก์ชั่นนัลเทรนนิ่ง · 4 สาขา',
      en: 'Pilates + functional training · 4 studios',
    },
    capability: {
      th: 'AI จองคลาส, แนะนำ class ตามเป้าหมาย, escalate การปรับ medical ให้ trainer',
      en: 'AI books classes, matches you to a class type by goal, escalates medical questions to a trainer',
    },
    greeting: {
      th: 'สวัสดีค่ะ Pulse Studio อยากจองคลาสหรือสอบถามคลาสไหนคะ บอกเป้าหมาย (ลดน้ำหนัก, ฟิตขึ้น, ฟื้นฟูบาดเจ็บ) ให้ดิฉันแนะนำคลาสที่เหมาะค่ะ คำถามเรื่อง medical condition ส่งต่อให้เทรนเนอร์นะคะ',
      en: 'Hi from Pulse Studio. Booking a class, or want a recommendation? Tell me your goal (weight loss, strength, injury recovery) and I can match you. Medical questions go to a trainer.',
    },
    starters: [
      {
        th: 'มือใหม่ พิลาทิสกับ functional ต่างกันยังไงคะ ควรเริ่มอันไหน',
        en: "I'm new — Pilates vs functional, what's the difference? Which should I start with?",
      },
      {
        th: 'มีคลาส Reformer ตอนเย็น 19:00 สาขาทองหล่อ พรุ่งนี้ว่างไหม',
        en: 'Any 7pm Reformer class at Thonglor branch tomorrow?',
      },
      {
        th: 'ต้องการยกเลิก booking #PB-2105 คืนเงินได้ไหม',
        en: 'Need to cancel booking #PB-2105 — refundable?',
      },
    ],
  },
  {
    id: 'supplements',
    icon: 'leaf',
    category: { th: 'Health Supplements', en: 'Health Supplements' },
    brand: 'Vita Bloom',
    tagline: {
      th: 'วิตามิน + อาหารเสริม · Thai FDA registered',
      en: 'Vitamins + supplements · Thai FDA registered',
    },
    capability: {
      th: 'AI รู้ว่าตอบอะไรไม่ได้ — escalate คำถามทางการแพทย์ให้เภสัชกร',
      en: "AI knows what it can't answer — escalates clinical questions to the pharmacist team",
    },
    greeting: {
      th: 'สวัสดีค่ะ Vita Bloom ถามเรื่องสินค้า, ส่วนผสม, หรือคำสั่งซื้อได้เลยค่ะ คำถามเกี่ยวกับสุขภาพเฉพาะบุคคลจะส่งต่อให้ทีมเภสัชกรดูแลโดยตรง เพื่อให้คำตอบที่ปลอดภัยและถูกต้องที่สุดค่ะ',
      en: 'Hi from Vita Bloom. Ask about products, ingredients, or orders. Anything about your specific health condition or medications goes to our pharmacist team directly so you get a safe, accurate answer.',
    },
    starters: [
      {
        th: 'ฉันมีความดันสูง กินวิตามินรวมตัวนี้ได้ไหมคะ',
        en: 'I have high blood pressure — can I take this multivitamin?',
      },
      {
        th: 'collagen ตัวนี้มีน้ำตาลกี่กรัมต่อซอง',
        en: 'How many grams of sugar per sachet in this collagen?',
      },
      {
        th: 'ส่งฟรีเมื่อสั่งครบเท่าไรคะ',
        en: "What's the free shipping threshold?",
      },
    ],
  },
];

export const SCENARIO_BY_ID = new Map(SCENARIOS.map((s) => [s.id, s]));

export function isScenarioId(v: string): v is ScenarioId {
  return SCENARIO_BY_ID.has(v as ScenarioId);
}
