import 'server-only';
import { unstable_cache } from 'next/cache';
import {
  aggregateSentimentByDay,
  clusterInboundMessages,
  scoreSentimentBatch,
} from '@crmos360/ai';
import { createAdminClient } from '@/lib/supabase/admin';
import type {
  MockAutomateNextCandidate,
  MockBottleneckCard,
  MockDashboardCluster,
  MockDashboardMetrics,
  MockSentimentPoint,
} from '@/lib/mocks/types';

/**
 * Build the Intelligence Dashboard metrics for one org from real data.
 *
 * Three sub-queries against Supabase:
 *   1. Last 30 days of inbound messages → clustering + automate-next
 *   2. Same set, scored for sentiment → 30-day trend
 *   3. Bottleneck SQL aggregations (slow response, after-hours, agent
 *      workload, rule coverage)
 *
 * Wrapped in unstable_cache with a 1-hour TTL keyed by orgId. The cache
 * tag is `intelligence:<orgId>` so a manual revalidate hook can flip the
 * cache after a refresh button or a daily cron pings it.
 */

const WINDOW_DAYS = 30;
const RECENT_MESSAGES_LIMIT = 2000;

interface InboundRow {
  id: string;
  body: string | null;
  channel: string;
  conversation_id: string;
  sent_at: string;
}

async function fetchOrgDashboardUncached(orgId: string): Promise<MockDashboardMetrics> {
  const admin = createAdminClient();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - WINDOW_DAYS);

  const { data: rows } = await admin
    .from('messages')
    .select('id, body, conversation_id, sent_at, conversations!inner(channel, org_id)')
    .eq('direction', 'inbound')
    .eq('conversations.org_id', orgId)
    .gte('sent_at', cutoff.toISOString())
    .order('sent_at', { ascending: false })
    .limit(RECENT_MESSAGES_LIMIT);

  type RawRow = {
    id: string;
    body: string | null;
    conversation_id: string;
    sent_at: string;
    conversations: { channel: string; org_id: string } | { channel: string; org_id: string }[];
  };

  const inbounds: InboundRow[] = ((rows ?? []) as RawRow[])
    .map((r): InboundRow | null => {
      const conv = Array.isArray(r.conversations) ? r.conversations[0] : r.conversations;
      if (!r.body || !conv) return null;
      return {
        id: r.id,
        body: r.body,
        channel: conv.channel,
        conversation_id: r.conversation_id,
        sent_at: r.sent_at,
      };
    })
    .filter((r): r is InboundRow => r !== null && r.body !== null);

  if (inbounds.length === 0) {
    return emptyDashboard();
  }

  // Run clustering + sentiment in parallel; both are bounded by the same
  // input set so they don't compete for the same provider quota.
  const [rawClusters, sentimentScores] = await Promise.all([
    clusterInboundMessages(
      inbounds.map((m) => ({
        id: m.id,
        body: m.body!,
        channel: m.channel,
        conversationId: m.conversation_id,
        sentAt: m.sent_at,
      })),
    ).catch((err) => {
      console.warn('[intelligence] clustering failed', err);
      return [];
    }),
    scoreSentimentBatch(
      inbounds.slice(0, 200).map((m) => ({ id: m.id, body: m.body! })),
    ).catch((err) => {
      console.warn('[intelligence] sentiment batch failed', err);
      return [] as Awaited<ReturnType<typeof scoreSentimentBatch>>;
    }),
  ]);

  const clusters: MockDashboardCluster[] = rawClusters.map((c) => ({
    id: c.id,
    representativeMessage: c.representativeMessage,
    volume: c.volume,
    weekOverWeek: c.weekOverWeek,
    channels: c.channels as MockDashboardCluster['channels'],
    sampleConversationIds: c.sampleConversationIds,
  }));

  const sentimentByMessage = new Map(sentimentScores.map((s) => [s.id, s]));
  const scoredForAggregate = inbounds
    .filter((m) => sentimentByMessage.has(m.id))
    .map((m) => ({
      ...sentimentByMessage.get(m.id)!,
      sentAt: m.sent_at,
      channel: m.channel,
    }));
  const sentimentTrend: MockSentimentPoint[] = aggregateSentimentByDay(
    scoredForAggregate,
    WINDOW_DAYS,
  ).map((p) => ({
    date: p.date,
    positive: p.positive,
    neutral: p.neutral,
    negative: p.negative,
  }));

  const automateNext: MockAutomateNextCandidate[] = clusters
    .slice(0, 5)
    .map((c, i) => ({
      id: `auto_${i + 1}_${c.id}`,
      trigger: c.representativeMessage,
      proposedAction: synthesizeProposedAction(c.representativeMessage),
      confidence: estimateAutoConfidence(c),
      matchingClusterId: c.id,
      estimatedCoverage: Math.round((c.volume / Math.max(1, inbounds.length)) * 100),
    }));

  const bottlenecks: MockBottleneckCard[] = await computeBottlenecks(orgId, inbounds);

  return {
    recurringQuestions: clusters,
    sentimentTrend,
    automateNext,
    bottlenecks,
  };
}

export const getOrgDashboard = (orgId: string) =>
  unstable_cache(
    () => fetchOrgDashboardUncached(orgId),
    ['intelligence-dashboard', orgId],
    {
      revalidate: 60 * 60, // 1 hour
      tags: [`intelligence:${orgId}`],
    },
  )();

// — Helpers —————————————————————————————————————————————————————————————

function emptyDashboard(): MockDashboardMetrics {
  return {
    recurringQuestions: [],
    sentimentTrend: aggregateSentimentByDay([], WINDOW_DAYS).map((p) => ({
      date: p.date,
      positive: p.positive,
      neutral: p.neutral,
      negative: p.negative,
    })),
    automateNext: [],
    bottlenecks: [],
  };
}

function synthesizeProposedAction(representative: string): string {
  // Naive proposal: ask the model later to refine; for now, surface a generic
  // hint. The Configuration Advisor (Chunk 17) replaces this with a real
  // rule candidate.
  if (/track|พัสดุ|ส่ง/i.test(representative)) {
    return 'Auto-reply with current Kerry tracking link + ETA when message matches this pattern.';
  }
  if (/ราคา|wholesale|price|cost/i.test(representative)) {
    return 'Auto-reply with the current pricing matrix; escalate when the customer asks for a custom quote.';
  }
  if (/refund|complaint|คืนเงิน|รีวิว/i.test(representative)) {
    return 'Acknowledge then escalate to senior agent within 5 minutes.';
  }
  return 'Send a templated acknowledgement; escalate if the customer follows up within 10 minutes.';
}

function estimateAutoConfidence(c: MockDashboardCluster): number {
  // High-volume clusters with consistent channel mix imply repeatable patterns.
  const volBoost = Math.min(0.3, c.volume / 500);
  const channelPenalty = c.channels.length > 3 ? -0.1 : 0;
  return Math.max(0.4, Math.min(0.96, 0.6 + volBoost + channelPenalty));
}

async function computeBottlenecks(
  orgId: string,
  inbounds: InboundRow[],
): Promise<MockBottleneckCard[]> {
  const admin = createAdminClient();
  const cards: MockBottleneckCard[] = [];

  // Slow-response: average minutes between an inbound and the next outbound.
  const { data: timing } = await admin.rpc('intelligence_response_p50', {
    org: orgId,
    window_days: WINDOW_DAYS,
  } as never);
  if (timing && typeof timing === 'object' && 'p50_minutes' in timing) {
    const r = timing as { p50_minutes: number; channel?: string };
    if (r.p50_minutes > 30) {
      cards.push({
        id: 'bot_slow_response',
        kind: 'slow-response',
        title: 'Median response time elevated',
        metric: `${Math.round(r.p50_minutes)} min`,
        delta: r.channel ? `${r.channel} bottleneck` : '',
        description:
          'Inbound messages are taking longer than 30 minutes for a first reply. Polling cadence on this channel may need work.',
      });
    }
  }

  // After-hours volume: rough proxy via timestamp hour.
  const ahCount = inbounds.filter((m) => {
    const h = new Date(m.sent_at).getUTCHours();
    return h < 1 || h > 15; // 22:00-08:00 ICT
  }).length;
  const ahShare = inbounds.length === 0 ? 0 : ahCount / inbounds.length;
  if (ahShare >= 0.18) {
    cards.push({
      id: 'bot_after_hours',
      kind: 'after-hours',
      title: 'After-hours volume',
      metric: `${Math.round(ahShare * 100)}% of inbound`,
      delta: 'window 22:00-08:00 ICT',
      description:
        'A meaningful share of inbound is arriving after staffed hours. Confidence-gated auto-reply could absorb the easy cases.',
    });
  }

  // Rule coverage: ask the auto-reply rule store how many active rules
  // match how many inbounds. Until Chunk 17 lands, surface a placeholder.
  cards.push({
    id: 'bot_rule_coverage',
    kind: 'rule-coverage',
    title: 'Auto-rule coverage',
    metric: 'Pending',
    delta: 'Configuration Advisor lands in M1.5 · Chunk 17',
    description:
      'Once approved rules start applying, this card will surface % of inbound auto-handled by Configuration Advisor rules.',
  });

  return cards;
}
