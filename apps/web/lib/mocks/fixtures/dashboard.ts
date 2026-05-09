import type {
  MockDashboardCluster,
  MockDashboardMetrics,
  MockSentimentPoint,
  MockAutomateNextCandidate,
  MockBottleneckCard,
} from '../types';

const dayString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};

const recurringQuestions: MockDashboardCluster[] = [
  {
    id: 'cluster_001',
    representativeMessage: 'พัสดุถึงไหนแล้วคะ',
    volume: 412,
    weekOverWeek: 8,
    channels: ['line', 'shopee', 'lazada'],
    sampleConversationIds: ['conv_001', 'conv_011', 'conv_013'],
  },
  {
    id: 'cluster_002',
    representativeMessage: 'มีโค้ดส่วนลด VIP เดือนนี้ไหม',
    volume: 287,
    weekOverWeek: 22,
    channels: ['line', 'instagram'],
    sampleConversationIds: ['conv_001', 'conv_015'],
  },
  {
    id: 'cluster_003',
    representativeMessage: 'ส่งฟรีไหมคะ / minimum spend',
    volume: 246,
    weekOverWeek: -4,
    channels: ['shopee', 'lazada', 'tiktok'],
    sampleConversationIds: ['conv_016', 'conv_007'],
  },
  {
    id: 'cluster_004',
    representativeMessage: 'ส่วนผสมมี alcohol/paraben/fragrance ไหม',
    volume: 189,
    weekOverWeek: 11,
    channels: ['line', 'shopee'],
    sampleConversationIds: ['conv_008'],
  },
  {
    id: 'cluster_005',
    representativeMessage: 'รอบเรียน TGAT/TPAT ใหม่เปิดเมื่อไหร่',
    volume: 134,
    weekOverWeek: 47, // pre-admissions surge
    channels: ['line', 'messenger'],
    sampleConversationIds: ['conv_005', 'conv_014'],
  },
  {
    id: 'cluster_006',
    representativeMessage: 'wholesale 50+ pcs ราคา',
    volume: 92,
    weekOverWeek: 3,
    channels: ['shopee', 'tiktok', 'line'],
    sampleConversationIds: ['conv_007', 'conv_003'],
  },
];

const sentimentTrend: MockSentimentPoint[] = (() => {
  const points: MockSentimentPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const baseNeg = 0.08 + Math.sin(i / 4) * 0.03;
    const negSpike = i === 12 ? 0.18 : 0; // simulate a known shipping incident
    points.push({
      date: dayString(i),
      negative: Math.max(0.02, baseNeg + negSpike),
      neutral: 0.42 + Math.cos(i / 5) * 0.04,
      positive: 0.5 - Math.sin(i / 4) * 0.03 - negSpike,
    });
  }
  return points;
})();

const automateNext: MockAutomateNextCandidate[] = [
  {
    id: 'auto_001',
    trigger: 'Customers asking "พัสดุถึงไหนแล้วคะ" with active Kerry tracking number',
    proposedAction: 'Auto-reply with Kerry tracking link + delivery ETA, no human review needed at >0.92 confidence',
    confidence: 0.94,
    matchingClusterId: 'cluster_001',
    estimatedCoverage: 18,
  },
  {
    id: 'auto_002',
    trigger: 'VIP customers (3+ orders in 90d) asking for current month\'s discount code',
    proposedAction: 'Auto-reply with active VIP code, expiry date, and minimum spend',
    confidence: 0.91,
    matchingClusterId: 'cluster_002',
    estimatedCoverage: 12,
  },
  {
    id: 'auto_003',
    trigger: 'Free-shipping threshold questions on Shopee/Lazada/TikTok',
    proposedAction: 'Auto-reply with channel-specific free-shipping threshold + active promo code',
    confidence: 0.96,
    matchingClusterId: 'cluster_003',
    estimatedCoverage: 11,
  },
  {
    id: 'auto_004',
    trigger: 'Ingredient questions on existing SKUs (alcohol/paraben/fragrance)',
    proposedAction: 'Auto-reply leading with absence claims ("alcohol-free, paraben-free") + KB link',
    confidence: 0.89,
    matchingClusterId: 'cluster_004',
    estimatedCoverage: 8,
  },
  {
    id: 'auto_005',
    trigger: 'TGAT/TPAT cohort start date inquiries',
    proposedAction: 'Auto-reply with next 3 cohort dates + price range + book-trial CTA',
    confidence: 0.88,
    matchingClusterId: 'cluster_005',
    estimatedCoverage: 6,
  },
];

const bottlenecks: MockBottleneckCard[] = [
  {
    id: 'bot_001',
    kind: 'after-hours',
    title: 'After-hours conversion drop',
    metric: '14% (vs 33% in-hours)',
    delta: '−19pp',
    description:
      'Conversations between 22:00–06:00 convert at 14% vs 33% in business hours. AI auto-handles 62% of after-hours volume but escalations sit until 9am.',
  },
  {
    id: 'bot_002',
    kind: 'slow-response',
    title: 'Median first-response time on Lazada',
    metric: '47 min',
    delta: '+12 min vs Shopee',
    description:
      'Lazada inbox polled less frequently than other channels — drives slower response and higher cart-abandonment rate. Worth investigating polling cadence.',
  },
  {
    id: 'bot_003',
    kind: 'agent-workload',
    title: 'Pim handling 38% of escalations',
    metric: '38% (vs target 25%)',
    delta: '+13pp',
    description:
      'Of last week\'s 142 human-handled conversations, 54 went to Pim. Other agents averaged 14. Suggest auto-distribution rule or agent capacity caps.',
  },
  {
    id: 'bot_004',
    kind: 'rule-coverage',
    title: '6 high-volume clusters not covered by rules',
    metric: '~1,360 conversations/mo',
    delta: 'opportunity',
    description:
      'Top recurring-question clusters that have no Configuration Advisor rule yet. Approving the 5 candidates in "Automate next" would cover ~55% of these.',
  },
];

export const dashboardMetrics: MockDashboardMetrics = {
  recurringQuestions,
  sentimentTrend,
  automateNext,
  bottlenecks,
};
