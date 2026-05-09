import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { respond } from '@/lib/concierge/respond';
import { listMessages } from '@/lib/concierge/store';
import { VERTICAL_COOKIE, isVertical } from '@/lib/marketing/vertical';

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
    return NextResponse.json({
      ok: true,
      threadId: result.threadId,
      reply: result.reply,
      flagged: result.flagged,
      status: result.status,
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
  const thread = findThreadBySession(sessionId);
  if (!thread) return NextResponse.json({ messages: [] });

  const messages = listMessages(thread.id).map((m) => ({
    direction: m.direction,
    body: m.body,
    createdAt: m.createdAt,
  }));
  return NextResponse.json({ threadId: thread.id, messages });
}
