import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { respond } from '@/lib/concierge/respond';
import { listMessages } from '@/lib/concierge/store';
import { VERTICAL_COOKIE, isVertical } from '@/lib/marketing/vertical';
import { accrueSpend, checkRateLimit } from '@/lib/concierge/rate-limit';

function getClientIp(req: Request): string {
  // Vercel sets x-forwarded-for; first entry is the originating client.
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  const real = req.headers.get('x-real-ip');
  return real ?? 'unknown';
}

const SESSION_COOKIE = 'flowaios-concierge-session';

const PostSchema = z.object({
  message: z.string().trim().min(1).max(2000),
});

async function ensureSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(SESSION_COOKIE)?.value;
  if (existing) return existing;
  const fresh = randomUUID();
  store.set(SESSION_COOKIE, fresh, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });
  return fresh;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'invalid' }, { status: 400 });
  }

  const sessionId = await ensureSessionId();
  const ip = getClientIp(req);

  // Rate limit BEFORE we touch the LLM.
  const verdict = checkRateLimit({ ip, sessionId });
  if (!verdict.ok) {
    const fallback =
      verdict.reason === 'global-budget'
        ? 'The concierge is taking a break for the day to avoid runaway cost. Try again tomorrow, or use the Contact team button.'
        : verdict.reason === 'ip-burst'
          ? 'Slow down a moment. Try again in a few seconds.'
          : 'You have hit the daily limit on this page. Click Contact team for a human reply.';
    return NextResponse.json(
      {
        ok: false,
        rateLimited: true,
        reason: verdict.reason,
        retryAfterSec: verdict.retryAfterSec ?? 60,
        reply: fallback,
      },
      {
        status: 429,
        headers: verdict.retryAfterSec
          ? { 'Retry-After': String(verdict.retryAfterSec) }
          : undefined,
      },
    );
  }

  const cookieStore = await cookies();
  const verticalRaw = cookieStore.get(VERTICAL_COOKIE)?.value;
  const vertical = isVertical(verticalRaw) ? verticalRaw : null;
  const userAgent = req.headers.get('user-agent');
  const utmSource = new URL(req.url).searchParams.get('utm_source');

  try {
    const result = await respond({
      sessionId,
      message: parsed.data.message,
      vertical,
      userAgent,
      utmSource,
    });
    accrueSpend(result.costMicros);
    return NextResponse.json({
      ok: true,
      threadId: result.threadId,
      reply: result.reply,
      flagged: result.flagged,
      status: result.status,
      handoffRequested: result.handoffRequested,
      cost: {
        tokensInput: result.tokensInput,
        tokensOutput: result.tokensOutput,
        micros: result.costMicros,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    console.error('[concierge] respond failed', err);
    return NextResponse.json(
      { ok: false, error: 'concierge unavailable', detail: msg },
      { status: 503 },
    );
  }
}

export async function GET() {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (!sessionId) return NextResponse.json({ messages: [] });

  // Find thread by session — for the visitor's own history.
  const { findThreadBySession } = await import('@/lib/concierge/store');
  const thread = await findThreadBySession(sessionId);
  if (!thread) return NextResponse.json({ messages: [] });

  const messages = (await listMessages(thread.id)).map((m) => ({
    direction: m.direction,
    body: m.body,
    createdAt: m.createdAt,
  }));
  return NextResponse.json({ threadId: thread.id, messages });
}
