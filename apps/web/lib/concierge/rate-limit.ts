/**
 * In-memory rate limiter for the marketing concierge endpoint.
 *
 * Three layers:
 *   1. Per-IP token bucket: 10 messages per 5 minutes
 *   2. Per-session daily cap: 30 messages per 24 hours
 *   3. Global daily floor on cost: degrades to a static reply when the
 *      day's spend crosses the budget ceiling
 *
 * In-memory only — survives just the lifetime of a single Vercel function
 * instance. Multi-instance prod environments will under-count, but that
 * is acceptable: the goal is to slow obvious abuse, not enforce a hard
 * billing ceiling. For a real production deploy, swap to Upstash
 * Ratelimit (REST-based, persists across instances).
 */

interface IpBucket {
  tokens: number;
  lastRefill: number;
}

interface SessionBucket {
  messagesSent: number;
  windowStart: number;
}

const IP_BUCKET_CAPACITY = 10; // burst
const IP_BUCKET_REFILL_PER_MS = 10 / (5 * 60 * 1000); // refill 10 over 5 minutes

const SESSION_DAILY_LIMIT = 30;
const SESSION_WINDOW_MS = 24 * 60 * 60 * 1000;

const GLOBAL_DAILY_BUDGET_MICROS = 5_000_000; // ~$5/day baseline

declare global {
  // eslint-disable-next-line no-var
  var __conciergeRate:
    | {
        ipBuckets: Map<string, IpBucket>;
        sessionBuckets: Map<string, SessionBucket>;
        globalSpend: { date: string; micros: number };
      }
    | undefined;
}

const state = (globalThis.__conciergeRate ??= {
  ipBuckets: new Map(),
  sessionBuckets: new Map(),
  globalSpend: { date: new Date().toISOString().slice(0, 10), micros: 0 },
});

export type RateLimitVerdict =
  | { ok: true }
  | { ok: false; reason: 'ip-burst' | 'session-daily' | 'global-budget'; retryAfterSec?: number };

export function checkRateLimit(opts: { ip: string; sessionId: string }): RateLimitVerdict {
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);

  // Reset global spend at UTC midnight.
  if (state.globalSpend.date !== today) {
    state.globalSpend = { date: today, micros: 0 };
  }

  if (state.globalSpend.micros >= GLOBAL_DAILY_BUDGET_MICROS) {
    return { ok: false, reason: 'global-budget', retryAfterSec: 3600 };
  }

  // Per-IP token bucket
  const ipBucket = state.ipBuckets.get(opts.ip) ?? {
    tokens: IP_BUCKET_CAPACITY,
    lastRefill: now,
  };
  const elapsed = now - ipBucket.lastRefill;
  ipBucket.tokens = Math.min(
    IP_BUCKET_CAPACITY,
    ipBucket.tokens + elapsed * IP_BUCKET_REFILL_PER_MS,
  );
  ipBucket.lastRefill = now;

  if (ipBucket.tokens < 1) {
    state.ipBuckets.set(opts.ip, ipBucket);
    const need = 1 - ipBucket.tokens;
    return {
      ok: false,
      reason: 'ip-burst',
      retryAfterSec: Math.ceil(need / IP_BUCKET_REFILL_PER_MS / 1000),
    };
  }

  // Per-session daily window
  const sessionBucket = state.sessionBuckets.get(opts.sessionId) ?? {
    messagesSent: 0,
    windowStart: now,
  };
  if (now - sessionBucket.windowStart >= SESSION_WINDOW_MS) {
    sessionBucket.messagesSent = 0;
    sessionBucket.windowStart = now;
  }
  if (sessionBucket.messagesSent >= SESSION_DAILY_LIMIT) {
    state.sessionBuckets.set(opts.sessionId, sessionBucket);
    return {
      ok: false,
      reason: 'session-daily',
      retryAfterSec: Math.ceil((SESSION_WINDOW_MS - (now - sessionBucket.windowStart)) / 1000),
    };
  }

  // Consume.
  ipBucket.tokens -= 1;
  sessionBucket.messagesSent += 1;
  state.ipBuckets.set(opts.ip, ipBucket);
  state.sessionBuckets.set(opts.sessionId, sessionBucket);

  return { ok: true };
}

/** Account spend toward the global daily budget. */
export function accrueSpend(micros: number): void {
  const today = new Date().toISOString().slice(0, 10);
  if (state.globalSpend.date !== today) {
    state.globalSpend = { date: today, micros: 0 };
  }
  state.globalSpend.micros += micros;
}

export function getRateLimitState() {
  return {
    globalSpendMicros: state.globalSpend.micros,
    globalBudgetMicros: GLOBAL_DAILY_BUDGET_MICROS,
    activeIps: state.ipBuckets.size,
    activeSessions: state.sessionBuckets.size,
  };
}
