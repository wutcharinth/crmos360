import type { MockAdvisorRule } from '../types';
import { MOCK_ORG_ID } from './customers';

const t = (daysAgo: number, hour = 10): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const advisorRules: MockAdvisorRule[] = [
  // — Active rules
  {
    id: 'rule_001',
    orgId: MOCK_ORG_ID,
    name: 'Kerry tracking auto-reply',
    condition: 'message contains tracking-related keywords AND order shipped via Kerry',
    action: 'reply with Kerry tracking URL + ETA from order.shipped_at + 2 days',
    source: 'lesson',
    sourceId: 'lesson_001',
    status: 'active',
    confidence: 0.94,
    appliedCount: 412,
    lastAppliedAt: t(0, 9),
    sampleMatches: [
      'พัสดุถึงไหนแล้วคะ สั่งวันที่ 5',
      'order ส่งหรือยังคะ',
      'tracking number ขอหน่อยครับ',
    ],
  },
  {
    id: 'rule_002',
    orgId: MOCK_ORG_ID,
    name: 'Clean-formulation ingredient lead',
    condition: 'message asks about alcohol/paraben/fragrance/preservative on a Klin Skin SKU',
    action: 'reply leads with "ของเราเป็น clean formulation, [list]-free" then offers full ingredient KB link',
    source: 'lesson',
    sourceId: 'lesson_002',
    status: 'active',
    confidence: 0.89,
    appliedCount: 189,
    lastAppliedAt: t(1, 14),
    sampleMatches: [
      'ส่วนผสมมี alcohol ไหมคะ ผิวบอบบาง',
      'มี paraben มั้ย',
      'fragrance free รึเปล่าคะ',
    ],
  },
  {
    id: 'rule_003',
    orgId: MOCK_ORG_ID,
    name: 'TGAT/TPAT cohort response template',
    condition: 'message asks about TGAT/TPAT/IB/IGCSE enrollment',
    action: 'reply with 3 upcoming cohort start dates + price range "฿28k–฿55k" + book-trial CTA',
    source: 'lesson',
    sourceId: 'lesson_006',
    status: 'active',
    confidence: 0.88,
    appliedCount: 134,
    lastAppliedAt: t(0, 11),
    sampleMatches: [
      'รอบ TGAT รอบหน้าเปิดเมื่อไหร่คะ',
      'TPAT3 มีคอร์สไหม',
      'IB program ราคาเท่าไร',
    ],
  },
  {
    id: 'rule_004',
    orgId: MOCK_ORG_ID,
    name: 'Clinical post-procedure pain — escalate',
    condition: 'patient message contains pain keywords AND last_procedure_at < 7 days',
    action: 'brief acknowledgment + page on-duty dentist; AI must NOT provide clinical assessment',
    source: 'lesson',
    sourceId: 'lesson_009',
    status: 'active',
    confidence: 0.99,
    appliedCount: 3,
    lastAppliedAt: t(0, 8),
    sampleMatches: [
      'หมอคะ ฟันที่อุดไว้ปวดมากเลยค่ะ',
      'หลัง treatment ปวดต่อเนื่อง 3 วันแล้ว',
      'อยากถามเรื่องอาการบวม',
    ],
  },
  {
    id: 'rule_005',
    orgId: MOCK_ORG_ID,
    name: 'B2B high-value quote — human draft',
    condition: 'B2B tag AND tenure ≥ 15y AND quote value > ฿50k',
    action: 'route to assignee from customer memory; AI generates draft only — does not send',
    source: 'lesson',
    sourceId: 'lesson_008',
    status: 'active',
    confidence: 0.97,
    appliedCount: 21,
    lastAppliedAt: t(2, 16),
    sampleMatches: [
      'พี่อ้อยครับ ขอราคา 200 ตัวนะ',
      'PO เดือนนี้น่าจะเป็นล็อตสุดท้าย',
      'tier เก่าได้ไหม',
    ],
  },

  // — Pending candidates
  {
    id: 'rule_006',
    orgId: MOCK_ORG_ID,
    name: 'VIP discount code — auto-reply',
    condition: 'customer.tags contains "vip" AND message asks about discount code',
    action: 'reply with current month\'s VIP code + expiry + minimum spend',
    source: 'cluster',
    sourceId: 'cluster_002',
    status: 'pending',
    confidence: 0.91,
    appliedCount: 0,
    lastAppliedAt: null,
    sampleMatches: [
      'มีโค้ดส่วนลด VIP เดือนนี้ไหม',
      'discount code ใช้ที่ไหน',
      'โค้ดสมาชิก',
    ],
  },
  {
    id: 'rule_007',
    orgId: MOCK_ORG_ID,
    name: 'Free-shipping threshold per channel',
    condition: 'message asks about free shipping AND channel in [shopee, lazada, tiktok]',
    action: 'auto-reply with channel-specific minimum + active promo code',
    source: 'cluster',
    sourceId: 'cluster_003',
    status: 'pending',
    confidence: 0.96,
    appliedCount: 0,
    lastAppliedAt: null,
    sampleMatches: [
      'ส่งฟรีไหมคะ',
      'minimum spend เท่าไรคะ',
      'free shipping ข้อกำหนด',
    ],
  },
  {
    id: 'rule_008',
    orgId: MOCK_ORG_ID,
    name: 'Wholesale request — verify SKU first',
    condition: 'message contains "wholesale" / "ขายส่ง" / "bulk"',
    action: 'reply asking for SKU + quantity; do not quote price until both confirmed',
    source: 'lesson',
    sourceId: 'lesson_003',
    status: 'pending',
    confidence: 0.83,
    appliedCount: 0,
    lastAppliedAt: null,
    sampleMatches: [
      'wholesale 50 pcs price?',
      'ขายส่งราคาเท่าไรคะ',
      'bulk order minimum',
    ],
  },
];

export const findRule = (id: string) => advisorRules.find((r) => r.id === id);
