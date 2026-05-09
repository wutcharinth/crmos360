import { generate } from './adapter';

/**
 * Gemini-driven sentiment scoring for inbox messages.
 *
 * Two flavors:
 *   1. `scoreSentimentBatch(messages)` — single LLM call with up to 30
 *      messages. Returns positive/neutral/negative score per message.
 *   2. `aggregateSentimentByDay(scored)` — buckets the scored messages
 *      into 30-day daily aggregates for the Intelligence Dashboard.
 *
 * The batch endpoint is the cost-driver. We cap at 30 per call to keep
 * latency under ~3s and to fit the Gemini context budget for short
 * messages. Caller batches as needed.
 */

const SYSTEM_PROMPT = `You score the sentiment of customer-service inbound messages on a 3-class scale.

Return strictly JSON with no commentary, an array indexed identically to the input array:
[{"id": "<message_id>", "sentiment": "positive"|"neutral"|"negative", "score": 0..1}]

Rules:
  - "positive" only when the customer expresses appreciation, satisfaction, or a positive experience.
  - "negative" when the customer complains, expresses frustration, asks for a refund, or threatens to escalate.
  - Default to "neutral" — most product questions and tracking inquiries are neutral.
  - score is a confidence value [0..1]. Use 0.5 for ambiguous; 0.9+ for unambiguous.

Inputs are typically Thai or English; treat both equivalently.`;

export interface SentimentInput {
  id: string;
  body: string;
}

export interface SentimentResult {
  id: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
}

const MAX_BATCH = 30;

export async function scoreSentimentBatch(
  messages: SentimentInput[],
): Promise<SentimentResult[]> {
  if (messages.length === 0) return [];
  if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    // No provider — default everything to neutral so the dashboard renders.
    return messages.map((m) => ({ id: m.id, sentiment: 'neutral', score: 0.5 }));
  }

  const out: SentimentResult[] = [];
  for (let i = 0; i < messages.length; i += MAX_BATCH) {
    const slice = messages.slice(i, i + MAX_BATCH);
    const userPrompt = JSON.stringify(slice);
    try {
      const res = await generate({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.0,
        maxTokens: 600,
      });
      const text = res.text.trim();
      const start = text.indexOf('[');
      const end = text.lastIndexOf(']');
      if (start === -1 || end === -1) {
        // Couldn't parse; default this batch to neutral.
        for (const m of slice) {
          out.push({ id: m.id, sentiment: 'neutral', score: 0.5 });
        }
        continue;
      }
      const parsed = JSON.parse(text.slice(start, end + 1)) as unknown;
      if (!Array.isArray(parsed)) throw new Error('not array');
      const idMap = new Map<string, SentimentResult>();
      for (const item of parsed) {
        if (
          typeof item === 'object' &&
          item !== null &&
          typeof (item as Record<string, unknown>).id === 'string' &&
          typeof (item as Record<string, unknown>).sentiment === 'string'
        ) {
          const r = item as { id: string; sentiment: string; score?: number };
          const sentiment = ['positive', 'neutral', 'negative'].includes(r.sentiment)
            ? (r.sentiment as SentimentResult['sentiment'])
            : 'neutral';
          idMap.set(r.id, {
            id: r.id,
            sentiment,
            score: typeof r.score === 'number' ? Math.max(0, Math.min(1, r.score)) : 0.5,
          });
        }
      }
      for (const m of slice) {
        out.push(idMap.get(m.id) ?? { id: m.id, sentiment: 'neutral', score: 0.5 });
      }
    } catch (err) {
      console.warn('sentiment batch failed', err);
      for (const m of slice) {
        out.push({ id: m.id, sentiment: 'neutral', score: 0.5 });
      }
    }
  }
  return out;
}

export interface DailySentiment {
  date: string; // YYYY-MM-DD
  positive: number; // share 0..1
  neutral: number;
  negative: number;
  channel?: string;
}

export function aggregateSentimentByDay(
  scored: (SentimentResult & { sentAt: string; channel: string })[],
  windowDays = 30,
): DailySentiment[] {
  const buckets = new Map<string, { p: number; n: number; g: number; total: number }>();
  for (let d = windowDays - 1; d >= 0; d--) {
    const day = new Date();
    day.setDate(day.getDate() - d);
    buckets.set(day.toISOString().slice(0, 10), { p: 0, n: 0, g: 0, total: 0 });
  }
  for (const m of scored) {
    const day = new Date(m.sentAt).toISOString().slice(0, 10);
    const b = buckets.get(day);
    if (!b) continue;
    if (m.sentiment === 'positive') b.p += 1;
    else if (m.sentiment === 'negative') b.g += 1;
    else b.n += 1;
    b.total += 1;
  }
  return [...buckets.entries()].map(([date, b]) => ({
    date,
    positive: b.total === 0 ? 0 : b.p / b.total,
    neutral: b.total === 0 ? 0 : b.n / b.total,
    negative: b.total === 0 ? 0 : b.g / b.total,
  }));
}
