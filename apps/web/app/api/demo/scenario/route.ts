import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateDetailed, type LlmMessage } from '@crmos360/ai';
import { getScenarioPrompt } from '@/lib/demo/scenario-prompts';
import { isScenarioId } from '@/lib/demo/scenarios';
import { checkRateLimit, accrueSpend } from '@/lib/concierge/rate-limit';
import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Backend for the per-category demo playground.
 *
 * The frontend swaps system prompts based on which scenario tab is
 * active. We pull the prompt server-side (kept off the client bundle)
 * and feed it to the existing generate() helper. Each scenario has
 * its own brand catalog + policies + special-behavior rules, so the
 * AI roleplays that store's CS agent.
 *
 * Same rate-limit envelope as the marketing concierge to keep cost
 * predictable: per-IP burst, per-session daily, global $5/day ceiling.
 */

const SESSION_COOKIE = 'flowaios-demo-scenario-session';

const PostSchema = z.object({
  scenarioId: z.string(),
  message: z.string().trim().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      }),
    )
    .max(20)
    .optional(),
});

function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

async function ensureSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(SESSION_COOKIE)?.value;
  if (existing) return existing;
  const fresh = randomUUID();
  store.set(SESSION_COOKIE, fresh, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  });
  return fresh;
}

const COST_INPUT_PER_TOKEN_MICROS = 0.075;
const COST_OUTPUT_PER_TOKEN_MICROS = 0.3;

function estimateTokens(text: string): number {
  // Per-codepoint split: Thai (U+0E00–U+0E7F) at ~2.5 chars/token,
  // others at ~4. Mirrors the concierge cost-tracking heuristic so
  // budget metering stays consistent.
  let thai = 0;
  let other = 0;
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    if (cp >= 0x0e00 && cp <= 0x0e7f) thai += 1;
    else other += 1;
  }
  return Math.ceil(thai / 2.5) + Math.ceil(other / 4);
}

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'no_ai_provider', reply: 'AI provider not configured.' },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'invalid' },
      { status: 400 },
    );
  }

  if (!isScenarioId(parsed.data.scenarioId)) {
    return NextResponse.json({ error: 'unknown_scenario' }, { status: 400 });
  }

  const sessionId = await ensureSessionId();
  const ip = getClientIp(req);

  const verdict = checkRateLimit({ ip, sessionId });
  if (!verdict.ok) {
    const fallback =
      verdict.reason === 'global-budget'
        ? 'The demo is taking a break for the day. Try again tomorrow.'
        : verdict.reason === 'ip-burst'
          ? 'Slow down a moment. Try again in a few seconds.'
          : 'You have hit the daily limit on this page.';
    return NextResponse.json(
      { ok: false, rateLimited: true, reason: verdict.reason, reply: fallback },
      { status: 429 },
    );
  }

  const systemPrompt = getScenarioPrompt(parsed.data.scenarioId);
  const messages: LlmMessage[] = [{ role: 'system', content: systemPrompt }];
  for (const m of parsed.data.history ?? []) {
    messages.push({ role: m.role, content: m.content });
  }
  messages.push({ role: 'user', content: parsed.data.message });

  try {
    // First attempt: generous headroom for Thai (more chars per token).
    let res = await generateDetailed({
      messages,
      temperature: 0.5,
      maxTokens: 1024,
    });

    // Retry once with more headroom if the model self-truncated.
    if (res.finishReason === 'max_tokens') {
      res = await generateDetailed({
        messages,
        temperature: 0.5,
        maxTokens: 1800,
      });
    }

    let reply = res.text.trim();

    // Safety / unknown finish with empty body → graceful fallback so the
    // user never sees a blank or partial bubble.
    if (!reply || res.safetyBlocked) {
      reply =
        'ขออนุญาตเช็คข้อมูลให้สักครู่นะคะ ขอเป็นเรื่องอื่นที่เกี่ยวกับสินค้าหรือคำสั่งซื้อก่อนนะคะ';
    } else if (res.finishReason === 'max_tokens' && !endsCleanly(reply)) {
      // Even after retry, strip the dangling clause so the bubble doesn't
      // end mid-word. Keeps the paragraph break intact for readability.
      reply = trimDanglingClause(reply);
    }

    const tokensIn = messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
    const tokensOut = estimateTokens(reply);
    const cost = Math.round(
      tokensIn * COST_INPUT_PER_TOKEN_MICROS +
        tokensOut * COST_OUTPUT_PER_TOKEN_MICROS,
    );
    accrueSpend(cost);

    return NextResponse.json({
      ok: true,
      reply,
      costMicros: cost,
      finishReason: res.finishReason,
    });
  } catch (err) {
    console.error('demo scenario LLM error', err);
    return NextResponse.json(
      {
        ok: false,
        reply:
          'ขอโทษนะคะ ระบบติดต่อ AI ไม่ได้ในขณะนี้ ลองอีกครั้งใน 1-2 นาทีค่ะ',
      },
      { status: 500 },
    );
  }
}

/** True if the text ends with a sentence-terminator or a complete Thai phrase ending. */
function endsCleanly(s: string): boolean {
  const last = s.trim().slice(-1);
  // Latin punctuation + ค่ะ/ครับ are common Thai sentence endings handled
  // upstream; here we just guard against ending mid-word.
  return /[.!?…ๆ"')\]]$|ค่ะ$|ครับ$|นะคะ$|นะครับ$/u.test(s.trim());
}

/** Drop the trailing fragment after the last paragraph break or terminator. */
function trimDanglingClause(s: string): string {
  const trimmed = s.trim();
  // Find the last sentence boundary.
  const lastTerminator = Math.max(
    trimmed.lastIndexOf('。'),
    trimmed.lastIndexOf('.'),
    trimmed.lastIndexOf('!'),
    trimmed.lastIndexOf('?'),
    trimmed.lastIndexOf('ค่ะ'),
    trimmed.lastIndexOf('ครับ'),
  );
  if (lastTerminator > Math.floor(trimmed.length * 0.4)) {
    // Cut after the terminator (+ matched suffix). Heuristic suffix length 3 (e.g. "ค่ะ").
    const suffixLen = trimmed[lastTerminator] === 'ค' || trimmed[lastTerminator] === 'ค' ? 2 : 0;
    return trimmed.slice(0, lastTerminator + 1 + suffixLen).trim();
  }
  return trimmed;
}
