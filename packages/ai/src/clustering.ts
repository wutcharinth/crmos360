import { embedBatch } from './embeddings';

/**
 * Lightweight inbound-message clustering for the Intelligence Dashboard.
 *
 * Greedy threshold-based clustering on cosine similarity. Single-pass, no
 * iterative refinement — the goal is to surface 5–10 representative
 * clusters of "the same recurring question", not produce a perfect
 * partition. Picks the highest-volume cluster's most-central message as
 * the representative.
 *
 * For ~2k messages the cost is dominated by the embed call (one batched
 * request); the local clustering runs in a few hundred ms. The caller
 * usually wraps this in a daily cron / lazy 1-hour cache.
 */

interface InputMessage {
  id: string;
  body: string;
  channel: string;
  conversationId: string;
  sentAt: string;
}

interface ClusterCentroid {
  centroid: number[];
  messageIds: string[];
  channels: Set<string>;
  conversationIds: Set<string>;
  sentAt: string[];
  representativeId: string;
  representativeBody: string;
  representativeSimilarity: number;
}

export interface MessageCluster {
  id: string;
  representativeMessage: string;
  volume: number;
  weekOverWeek: number;
  channels: string[];
  sampleConversationIds: string[];
}

const SIMILARITY_THRESHOLD = 0.78; // empirically reasonable for short messages
const MIN_CLUSTER_SIZE = 4;
const MAX_CLUSTERS_RETURNED = 10;

export async function clusterInboundMessages(
  messages: InputMessage[],
): Promise<MessageCluster[]> {
  if (messages.length === 0) return [];

  // Trim very short messages and obvious greetings — they form noise
  // clusters and don't give useful Operator signals.
  const eligible = messages.filter(
    (m) => m.body.trim().length >= 4 && !looksLikeGreeting(m.body),
  );
  if (eligible.length === 0) return [];

  const embeddings = await embedBatch(eligible.map((m) => m.body));

  const clusters: ClusterCentroid[] = [];

  for (let i = 0; i < eligible.length; i++) {
    const msg = eligible[i]!;
    const emb = embeddings[i]!;
    let bestIndex = -1;
    let bestSimilarity = -1;

    for (let j = 0; j < clusters.length; j++) {
      const sim = cosine(clusters[j]!.centroid, emb);
      if (sim > bestSimilarity) {
        bestSimilarity = sim;
        bestIndex = j;
      }
    }

    if (bestIndex !== -1 && bestSimilarity >= SIMILARITY_THRESHOLD) {
      const c = clusters[bestIndex]!;
      // Streaming centroid update.
      const n = c.messageIds.length;
      for (let d = 0; d < c.centroid.length; d++) {
        c.centroid[d] = (c.centroid[d]! * n + emb[d]!) / (n + 1);
      }
      c.messageIds.push(msg.id);
      c.channels.add(msg.channel);
      c.conversationIds.add(msg.conversationId);
      c.sentAt.push(msg.sentAt);
      // Track the message most aligned with the centroid as representative.
      if (bestSimilarity > c.representativeSimilarity) {
        c.representativeId = msg.id;
        c.representativeBody = msg.body;
        c.representativeSimilarity = bestSimilarity;
      }
    } else {
      clusters.push({
        centroid: [...emb],
        messageIds: [msg.id],
        channels: new Set([msg.channel]),
        conversationIds: new Set([msg.conversationId]),
        sentAt: [msg.sentAt],
        representativeId: msg.id,
        representativeBody: msg.body,
        representativeSimilarity: 1,
      });
    }
  }

  const dense = clusters.filter((c) => c.messageIds.length >= MIN_CLUSTER_SIZE);
  dense.sort((a, b) => b.messageIds.length - a.messageIds.length);

  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  return dense.slice(0, MAX_CLUSTERS_RETURNED).map((c, idx) => {
    const ts = c.sentAt.map((s) => new Date(s).getTime());
    const lastWeek = ts.filter((t) => now - t < sevenDays).length;
    const priorWeek = ts.filter((t) => now - t >= sevenDays && now - t < 2 * sevenDays).length;
    const wow = priorWeek === 0 ? 0 : Math.round(((lastWeek - priorWeek) / priorWeek) * 100);
    return {
      id: `cluster_${idx + 1}_${c.representativeId.slice(0, 8)}`,
      representativeMessage: c.representativeBody,
      volume: c.messageIds.length,
      weekOverWeek: wow,
      channels: [...c.channels].sort(),
      sampleConversationIds: [...c.conversationIds].slice(0, 5),
    };
  });
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    na += a[i]! * a[i]!;
    nb += b[i]! * b[i]!;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

const GREETING_PATTERNS = [
  /^(hi|hello|hey|sawadee|สวัสดี|ครับ|ค่ะ|คะ|hello+\W*$)/i,
  /^(thanks|thx|thank you|ขอบคุณ|ขอบใจ)/i,
  /^(ok|okay|got it|รับทราบ|ครับ|ค่ะ)\W*$/i,
];

function looksLikeGreeting(body: string): boolean {
  const trimmed = body.trim();
  if (trimmed.length < 4) return true;
  return GREETING_PATTERNS.some((p) => p.test(trimmed));
}
