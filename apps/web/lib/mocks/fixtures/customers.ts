import type { MockCustomer } from '../types';

export const MOCK_ORG_ID = 'org_demo_0001';

const t = (daysAgo: number, hour = 10, min = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

export const customers: MockCustomer[] = [
  {
    id: 'cust_001',
    orgId: MOCK_ORG_ID,
    name: 'พิมพ์ลภัส บุญรอด',
    avatarColor: 'bg-warm-soft text-warm',
    channelIds: { line: 'U1a2b3c001', shopee: 'shopee_pim01' },
    tags: ['vip', 'returning'],
    vertical: 'commerce',
    memory: [
      {
        id: 'mem_001',
        kind: 'fact',
        content: 'แพ้ paraben — ตรวจสอบส่วนผสมก่อนแนะนำสินค้า',
        createdAt: t(45),
        status: 'approved',
      },
      {
        id: 'mem_002',
        kind: 'fact',
        content: 'ส่ง Kerry Express, ที่อยู่ Asoke',
        createdAt: t(20),
        status: 'approved',
      },
      {
        id: 'mem_003',
        kind: 'summary',
        content: 'Repeat skincare buyer; bought cleansing balm + toner 3x in last 90 days. AOV ฿890.',
        createdAt: t(15),
        status: 'approved',
      },
    ],
  },
  {
    id: 'cust_002',
    orgId: MOCK_ORG_ID,
    name: 'James Whittaker',
    avatarColor: 'bg-mint-soft text-mint',
    channelIds: { instagram: 'ig_jameswhitt' },
    tags: ['expat', 'first-time'],
    vertical: 'commerce',
    memory: [
      { id: 'mem_004', kind: 'note', content: 'English-speaking customer; prefers replies in English.', createdAt: t(2), status: 'approved' },
    ],
  },
  {
    id: 'cust_003',
    orgId: MOCK_ORG_ID,
    name: 'อรวรรณ สุขใส',
    avatarColor: 'bg-paper-3 text-ink',
    channelIds: { line: 'U_aor003', tiktok: 'tt_aor' },
    tags: ['high-volume'],
    vertical: 'commerce',
    memory: [
      { id: 'mem_005', kind: 'fact', content: 'สั่งล็อตใหญ่ทุกเดือน — ขอราคาส่ง', createdAt: t(60), status: 'approved' },
    ],
  },
  {
    id: 'cust_004',
    orgId: MOCK_ORG_ID,
    name: 'Khun Somsak Phongphan',
    avatarColor: 'bg-warm-soft text-warm',
    channelIds: { line: 'U_somsak', email: 'somsak@boonengineer.co.th' },
    tags: ['b2b', 'priority'],
    vertical: 'b2b',
    memory: [
      { id: 'mem_006', kind: 'fact', content: 'B2B account: 15-year customer. Tier-2 pricing. Net-30 payment. Always order M8x30 hex bolts.', createdAt: t(120), status: 'approved' },
      { id: 'mem_007', kind: 'fact', content: 'Primary contact: พี่อ้อย (P\'Aoy). Backup contact: คุณวิชัย.', createdAt: t(120), status: 'approved' },
      { id: 'mem_008', kind: 'note', content: 'Previously requested grade 8.8 only — refused 4.6 substitute even when in stock.', createdAt: t(45), status: 'pending' },
    ],
  },
  {
    id: 'cust_005',
    orgId: MOCK_ORG_ID,
    name: 'นภัส กิตติคุณ',
    avatarColor: 'bg-mint-soft text-mint',
    channelIds: { line: 'U_naphas', messenger: 'fb_naphas' },
    tags: ['parent', 'TGAT-prep'],
    vertical: 'services',
    memory: [
      { id: 'mem_009', kind: 'fact', content: 'ลูกชายชั้น ม.6, เตรียม TGAT รอบ Sept-Dec. โรงเรียนสาธิต.', createdAt: t(20), status: 'approved' },
      { id: 'mem_010', kind: 'note', content: 'Asked about TPAT3 supplemental — escalated to academic counsellor.', createdAt: t(7), status: 'approved' },
    ],
  },
  {
    id: 'cust_006',
    orgId: MOCK_ORG_ID,
    name: 'Khun Apinya Sungkhanan',
    avatarColor: 'bg-warm-soft text-warm',
    channelIds: { line: 'U_apinya' },
    tags: ['clinic-patient'],
    vertical: 'services',
    memory: [
      { id: 'mem_011', kind: 'fact', content: 'Patient at Phrom Phong branch. Last visit: cleaning + check-up. Next due in 4 months.', createdAt: t(60), status: 'pending' },
    ],
  },
  {
    id: 'cust_007',
    orgId: MOCK_ORG_ID,
    name: 'Lin Wei',
    avatarColor: 'bg-mint-soft text-mint',
    channelIds: { line: 'U_linwei', shopee: 'shopee_lin' },
    tags: ['mainland-CN', 'wholesale'],
    vertical: 'commerce',
    memory: [
      { id: 'mem_012', kind: 'note', content: 'Prefers WeChat-style brevity; communicates in mixed EN/Mandarin.', createdAt: t(10), status: 'approved' },
    ],
  },
  {
    id: 'cust_008',
    orgId: MOCK_ORG_ID,
    name: 'ภัทรา ตั้งเจริญ',
    avatarColor: 'bg-paper-3 text-ink',
    channelIds: { line: 'U_phattra', shopee: 'shopee_phat' },
    tags: [],
    vertical: 'commerce',
    memory: [
      { id: 'mem_013', kind: 'fact', content: 'Asked about ingredient list 3x — sensitive skin concern.', createdAt: t(5), status: 'approved' },
    ],
  },
  {
    id: 'cust_009',
    orgId: MOCK_ORG_ID,
    name: 'คุณวิภา จันทร์เพ็ญ',
    avatarColor: 'bg-warm-soft text-warm',
    channelIds: { line: 'U_wipa' },
    tags: ['agency-client'],
    vertical: 'customer-ops',
    memory: [],
  },
  {
    id: 'cust_010',
    orgId: MOCK_ORG_ID,
    name: 'Marcus Chen',
    avatarColor: 'bg-mint-soft text-mint',
    channelIds: { instagram: 'ig_marcuschen', email: 'marcus@nordic-ops.com' },
    tags: ['enterprise-eval'],
    vertical: 'customer-ops',
    memory: [
      { id: 'mem_014', kind: 'note', content: 'Evaluating for SG ops team. Asks about PDPA + data residency.', createdAt: t(3), status: 'approved' },
    ],
  },
  {
    id: 'cust_011',
    orgId: MOCK_ORG_ID,
    name: 'สมจิตร ใจกล้า',
    avatarColor: 'bg-paper-3 text-ink',
    channelIds: { line: 'U_somjit' },
    tags: ['repeat-issue'],
    vertical: 'commerce',
    memory: [
      { id: 'mem_015', kind: 'fact', content: 'Has had 2 shipping disputes in 60 days. Tag: monitor closely.', createdAt: t(40), status: 'approved' },
    ],
  },
  {
    id: 'cust_012',
    orgId: MOCK_ORG_ID,
    name: 'นาย ปกรณ์ พิทักษ์ชาติ',
    avatarColor: 'bg-warm-soft text-warm',
    channelIds: { line: 'U_pakorn', email: 'pakorn@partner.co.th' },
    tags: ['b2b', 'distributor'],
    vertical: 'b2b',
    memory: [
      { id: 'mem_016', kind: 'fact', content: 'Distributor in อยุธยา. Resells to local hardware stores. Net-15.', createdAt: t(180), status: 'approved' },
    ],
  },
];

export const findCustomer = (id: string) => customers.find((c) => c.id === id);
