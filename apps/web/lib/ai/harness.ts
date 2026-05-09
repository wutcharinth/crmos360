import 'server-only';
import { randomUUID } from 'node:crypto';
import {
  generateDetailed,
  type LlmDetailedResponse,
  type LlmMessage,
} from '@crmos360/ai';

/**
 * AI execution harness.
 *
 * Wraps generateDetailed() with:
 *   - per-call trace_id for cross-table correlation,
 *   - automatic provider fallback (Gemini → Claude when Gemini fails or
 *     is safety-blocked),
 *   - structured-output (JSON) parsing with retry,
 *   - context budget metering (sums input/output tokens, callers can
 *     soft-cap),
 *   - confidence gating helper that maps a numeric score to a routing
 *     tier the auto-reply pipeline can act on (auto / approval /
 *     escalate).
 *
 * Every harness call adds a record to ai_logs (deferred — caller decides
 * exact `kind`) and propagates the trace_id so a /admin/ai-logs row can
 * link back to the conversation, the message, and the memory citations
 * the request made.
 */

export type ConfidenceTier = 'auto' | 'approval' | 'escalate';

export interface HarnessRequest {
  messages: LlmMessage[];
  temperature?: number;
  maxTokens?: number;
  /** Required by /admin/ai-logs to group calls in a single conversation turn. */
  traceId?: string;
  /** When true, auto-fall-through to Claude on Gemini failure. */
  fallback?: boolean;
}

export interface HarnessResponse extends LlmDetailedResponse {
  traceId: string;
  attemptedProviders: ('gemini' | 'anthropic')[];
  fallbackUsed: boolean;
}

export function newTraceId(): string {
  return randomUUID();
}

export async function harnessGenerate(req: HarnessRequest): Promise<HarnessResponse> {
  const traceId = req.traceId ?? newTraceId();
  const attempted: ('gemini' | 'anthropic')[] = [];
  const wantFallback = req.fallback ?? true;

  const tryProvider = async (provider: 'gemini' | 'anthropic'): Promise<LlmDetailedResponse> => {
    attempted.push(provider);
    return generateDetailed({
      messages: req.messages,
      temperature: req.temperature,
      maxTokens: req.maxTokens,
      provider,
    });
  };

  let res: LlmDetailedResponse;
  let fallbackUsed = false;

  try {
    res = await tryProvider('gemini');
  } catch (err) {
    if (!wantFallback || !process.env.ANTHROPIC_API_KEY) throw err;
    res = await tryProvider('anthropic');
    fallbackUsed = true;
    return { ...res, traceId, attemptedProviders: attempted, fallbackUsed };
  }

  // Empty or safety-blocked from Gemini → try Claude (often less restrictive
  // for benign customer-service content that hits Gemini's safety filter).
  if (
    wantFallback &&
    process.env.ANTHROPIC_API_KEY &&
    (res.text.trim() === '' || res.safetyBlocked)
  ) {
    try {
      res = await tryProvider('anthropic');
      fallbackUsed = true;
    } catch {
      // keep the empty Gemini result; caller decides what to do
    }
  }

  return { ...res, traceId, attemptedProviders: attempted, fallbackUsed };
}

const STRUCTURED_RETRY_HINT = `
Your previous reply was not valid JSON. Reply ONLY with the JSON object — no
prose, no fences, no markdown. Match the schema described above exactly.`;

/**
 * Parse a JSON-typed LLM response. Strips fences, finds the first {…}
 * or […] block, retries once with a "you returned invalid JSON" hint
 * if needed. Returns null if both attempts fail.
 */
export async function harnessGenerateStructured<T>(args: {
  messages: LlmMessage[];
  validator: (raw: unknown) => T | null;
  temperature?: number;
  maxTokens?: number;
  traceId?: string;
}): Promise<{ parsed: T | null; raw: string; res: HarnessResponse }> {
  const first = await harnessGenerate({
    messages: args.messages,
    temperature: args.temperature,
    maxTokens: args.maxTokens,
    traceId: args.traceId,
  });

  const parsedFirst = tryParse<T>(first.text, args.validator);
  if (parsedFirst.value != null) return { parsed: parsedFirst.value, raw: first.text, res: first };

  // Retry once with a stricter hint.
  const retryMessages: LlmMessage[] = [
    ...args.messages,
    { role: 'assistant', content: first.text },
    { role: 'user', content: STRUCTURED_RETRY_HINT },
  ];
  const second = await harnessGenerate({
    messages: retryMessages,
    temperature: 0,
    maxTokens: args.maxTokens,
    traceId: args.traceId,
  });
  const parsedSecond = tryParse<T>(second.text, args.validator);
  return { parsed: parsedSecond.value, raw: second.text, res: second };
}

function tryParse<T>(text: string, validator: (raw: unknown) => T | null): { value: T | null } {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
  const trimmed = cleaned.trim();
  const candidates: string[] = [trimmed];
  const objStart = trimmed.indexOf('{');
  const objEnd = trimmed.lastIndexOf('}');
  if (objStart >= 0 && objEnd > objStart) candidates.push(trimmed.slice(objStart, objEnd + 1));
  const arrStart = trimmed.indexOf('[');
  const arrEnd = trimmed.lastIndexOf(']');
  if (arrStart >= 0 && arrEnd > arrStart) candidates.push(trimmed.slice(arrStart, arrEnd + 1));

  for (const c of candidates) {
    try {
      const value = validator(JSON.parse(c));
      if (value != null) return { value };
    } catch {
      // try next
    }
  }
  return { value: null };
}

/** Map a confidence (0-1) and signals to a routing decision. */
export function gateConfidence(args: {
  confidence: number;
  hasNegativeSentiment?: boolean;
  hasLegalKeyword?: boolean;
  isFirstContact?: boolean;
}): ConfidenceTier {
  if (args.hasLegalKeyword) return 'escalate';
  if (args.hasNegativeSentiment && args.confidence < 0.7) return 'escalate';
  if (args.confidence < 0.55) return 'approval';
  if (args.confidence < 0.75 && args.isFirstContact) return 'approval';
  return 'auto';
}

const LEGAL_KEYWORDS = [
  'แจ้งความ',
  'ฟ้อง',
  'ทนาย',
  'sue',
  'lawyer',
  'lawsuit',
  'attorney',
  'legal action',
  'consumer protection',
  'sor bor',
];

const NEGATIVE_KEYWORDS = [
  'แย่',
  'ไม่พอใจ',
  'โกง',
  'หลอก',
  'cancel',
  'refund',
  'angry',
  'terrible',
  'worst',
  'scam',
  'fraud',
];

export function quickSentimentSignals(text: string): {
  hasLegalKeyword: boolean;
  hasNegativeSentiment: boolean;
} {
  const lower = text.toLowerCase();
  return {
    hasLegalKeyword: LEGAL_KEYWORDS.some((k) => lower.includes(k.toLowerCase())),
    hasNegativeSentiment: NEGATIVE_KEYWORDS.some((k) => lower.includes(k.toLowerCase())),
  };
}
