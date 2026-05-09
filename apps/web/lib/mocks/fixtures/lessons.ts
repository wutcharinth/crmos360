import type { MockLesson } from '../types';
import { MOCK_ORG_ID } from './customers';

const t = (daysAgo: number, hour = 10): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const lessons: MockLesson[] = [
  {
    id: 'lesson_001',
    orgId: MOCK_ORG_ID,
    statement: 'Tracking-status questions for orders shipped via Kerry should auto-reply with the current Kerry tracking URL + ETA.',
    reasoning:
      'Identified from 47 conversations in last 30 days where AI suggested generic "let me check" and human edited to provide Kerry-specific tracking link. Auto-reply confidence raised to 0.94 after pattern repeated.',
    sourceConversationId: 'conv_001',
    status: 'approved',
    suggestedRule: {
      condition: 'message contains tracking-related keywords AND order channel is "kerry"',
      action: 'reply with Kerry tracking URL template + ETA from order.shipped_at + 2 days',
    },
    createdAt: t(8),
    approvedAt: t(7),
    approvedByName: 'Pim Tanasarn',
  },
  {
    id: 'lesson_002',
    orgId: MOCK_ORG_ID,
    statement: 'Ingredient questions on Klin Skin products should always state "alcohol-free, paraben-free, fragrance-free" upfront when relevant.',
    reasoning:
      'Pattern detected in 22 conversations: customers asking about specific ingredients (alcohol, paraben, fragrance) get higher CSAT when reply leads with the absence list rather than full ingredient breakdown. Aligns with brand voice for sensitive-skin segment.',
    sourceConversationId: 'conv_008',
    status: 'approved',
    suggestedRule: {
      condition: 'message asks about ingredient (alcohol|paraben|fragrance|preservative)',
      action: 'reply leads with "ของเราเป็น clean formulation, [specific-list]-free" then offers full ingredient list link',
    },
    createdAt: t(15),
    approvedAt: t(14),
    approvedByName: 'Nat Phromsri',
  },
  {
    id: 'lesson_003',
    orgId: MOCK_ORG_ID,
    statement: 'Wholesale price requests on social channels (Shopee, IG, TikTok) should ask for SKU and quantity before quoting.',
    reasoning:
      'AI was generating wholesale-tier quotes without verifying SKU availability — 8 cases in last 14 days where quoted price did not match actual SKU stock. Adding the verification step before quote.',
    sourceConversationId: 'conv_007',
    status: 'pending',
    suggestedRule: {
      condition: 'message contains "wholesale" or "ขายส่ง" or "bulk"',
      action: 'reply asking for specific SKU + quantity; do not quote price until both confirmed',
    },
    createdAt: t(2),
    approvedAt: null,
    approvedByName: null,
  },
  {
    id: 'lesson_004',
    orgId: MOCK_ORG_ID,
    statement: 'Reservation/booking requests for clinic must escalate to a human if the requested slot is within 4 hours.',
    reasoning:
      'Last-minute booking requests have 23% no-show rate when AI auto-confirms; jumps to 4% when human-confirmed (clinic team can verify chair availability + send personal reminder).',
    sourceConversationId: null,
    status: 'pending',
    suggestedRule: {
      condition: 'booking request AND requested_slot_at - now < 4 hours',
      action: 'escalate to human; do not auto-confirm; send "checking with team" acknowledgment',
    },
    createdAt: t(3),
    approvedAt: null,
    approvedByName: null,
  },
  {
    id: 'lesson_005',
    orgId: MOCK_ORG_ID,
    statement: 'Discount code requests from VIP customers (3+ purchases in 90 days) should auto-reply with the current monthly VIP code.',
    reasoning:
      'Pattern: 31 VIP customers asked for discount codes in last 30 days. Pre-existing template "monthly VIP code" was applied 28/31 times by humans — clear automation candidate.',
    sourceConversationId: 'conv_001',
    status: 'pending',
    suggestedRule: {
      condition: 'customer.tags contains "vip" AND message asks about discount code',
      action: 'reply with current month\'s VIP_CODE_VAR (env-bound)',
    },
    createdAt: t(1),
    approvedAt: null,
    approvedByName: null,
  },
  {
    id: 'lesson_006',
    orgId: MOCK_ORG_ID,
    statement: 'TGAT/TPAT exam-prep enrollment questions should always include the next 3 cohort start dates and a price range, never a single price.',
    reasoning:
      'Education-vertical pattern. Single-price replies have 38% drop-off; multi-cohort replies have 12%. Parents want to compare options.',
    sourceConversationId: 'conv_005',
    status: 'approved',
    suggestedRule: {
      condition: 'message asks about TGAT/TPAT/IB/IGCSE enrollment',
      action: 'reply with 3 upcoming cohort start dates + price range "฿28k–฿55k depending on intensity"',
    },
    createdAt: t(11),
    approvedAt: t(10),
    approvedByName: 'Win Sittiporn',
  },
  {
    id: 'lesson_007',
    orgId: MOCK_ORG_ID,
    statement: 'Shipping complaints with sentiment "negative" should escalate to human within 5 minutes; do not auto-respond beyond acknowledgment.',
    reasoning:
      'Negative shipping complaints auto-replied to had 71% follow-up complaint rate; human-handled had 22%. Customers want to feel heard, not given a tracking number.',
    sourceConversationId: 'conv_011',
    status: 'rejected',
    suggestedRule: {
      condition: 'message intent = "shipping_complaint" AND sentiment.negative > 0.6',
      action: 'send brief acknowledgment + escalate to human queue',
    },
    createdAt: t(20),
    approvedAt: t(20),
    approvedByName: 'Pim Tanasarn',
  },
  {
    id: 'lesson_008',
    orgId: MOCK_ORG_ID,
    statement: 'B2B repeat customers (15+ year tenure) should never get AI-only responses to quote requests above ฿50,000.',
    reasoning:
      'High-value relationships. Even when AI confidence is high, human touch on quotes preserves the long-term relationship. Memory: "deals only with พี่อ้อย" pattern surfaced from 4 customers.',
    sourceConversationId: 'conv_004',
    status: 'approved',
    suggestedRule: {
      condition: 'customer.tags contains "b2b" AND customer.tenure_years > 15 AND quote_value > 50000',
      action: 'route to assigneeName from memory; AI assists with draft only',
    },
    createdAt: t(12),
    approvedAt: t(11),
    approvedByName: 'Tep Boonrueang',
  },
  {
    id: 'lesson_009',
    orgId: MOCK_ORG_ID,
    statement: 'Clinical questions about post-procedure pain >48h after a treatment must be escalated to a dentist; AI must never give clinical-sounding reassurance.',
    reasoning:
      'PDPA + medical practitioner act compliance. AI replied with "this is normal" in 3 cases; 1 led to a regulatory complaint. Mandatory rule.',
    sourceConversationId: 'conv_006',
    status: 'approved',
    suggestedRule: {
      condition: 'patient_message contains pain-related keywords AND last_procedure_at < 7 days ago',
      action: 'send brief acknowledgment + page on-duty dentist; AI must not provide clinical assessment',
    },
    createdAt: t(6),
    approvedAt: t(5),
    approvedByName: 'Dr. Pong V.',
  },
  {
    id: 'lesson_010',
    orgId: MOCK_ORG_ID,
    statement: 'Sample kit requests on LINE OA should respond with discovery-set link + free shipping mention if customer arrived from TikTok.',
    reasoning:
      'TikTok-sourced traffic converts 2.3x higher when reply mentions free-shipping perk. Pattern: 19 of 23 conversions in last 14 days came from this exact response shape.',
    sourceConversationId: 'conv_015',
    status: 'pending',
    suggestedRule: {
      condition: 'message asks about sample/discovery/trial AND attribution_source = "tiktok"',
      action: 'reply with discovery-set link + "Free shipping if you mention TikTok"',
    },
    createdAt: t(1),
    approvedAt: null,
    approvedByName: null,
  },
  {
    id: 'lesson_011',
    orgId: MOCK_ORG_ID,
    statement: 'After-hours messages (10pm–6am Thai time) should set expectation: AI handles simple cases, complex cases get morning reply.',
    reasoning:
      'After-hours auto-reply confidence is on average 11pp lower than business-hours due to more open-ended questions. Setting expectation reduces frustration.',
    sourceConversationId: null,
    status: 'rejected',
    suggestedRule: {
      condition: 'sent_at hour in 22-06 Asia/Bangkok',
      action: 'append "ทีมจะตอบรายละเอียดเพิ่มเติมพรุ่งนี้เช้าค่ะ" if confidence < 0.7',
    },
    createdAt: t(25),
    approvedAt: t(24),
    approvedByName: 'Nat Phromsri',
  },
  {
    id: 'lesson_012',
    orgId: MOCK_ORG_ID,
    statement: 'Ingredient questions about new SKUs (added in last 14 days) should escalate to human until KB article is published.',
    reasoning:
      'New SKUs lack ingredient KB entries; AI hallucinated formulation details twice in past month. Escalate-by-default for 14 days post-launch.',
    sourceConversationId: null,
    status: 'pending',
    suggestedRule: {
      condition: 'message asks about ingredient AND sku.created_at > 14 days ago',
      action: 'escalate to human; do not generate ingredient response',
    },
    createdAt: t(0, 9),
    approvedAt: null,
    approvedByName: null,
  },
];

export const findLesson = (id: string) => lessons.find((l) => l.id === id);
