import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'flowaios-concierge-session';

/**
 * Reset the visitor's concierge session. Rotates the session cookie so the
 * next POST to /api/concierge starts a fresh thread + empty history. The
 * old thread persists server-side for ops review on /admin/prospects.
 *
 * Public endpoint, no auth — same trust model as /api/concierge.
 */
export async function POST() {
  const store = await cookies();
  // Expire the cookie. Browser will drop it; the next POST creates a new
  // session via ensureSessionId().
  store.set(SESSION_COOKIE, '', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0,
  });
  return NextResponse.json({ ok: true });
}
