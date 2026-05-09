/**
 * Prospect-thread store for the marketing concierge chatbot.
 *
 * Prototype implementation: in-memory Map, scoped per server instance.
 * Resets on dev-server restart. The shape mirrors the planned Supabase
 * tables (prospect_threads, prospect_messages, llm_usage) so swapping to
 * real persistence is a one-file change.
 *
 * For a multi-instance deploy, replace the Map with a Supabase-backed
 * implementation that respects the same `Store` interface.
 */
import { randomUUID } from 'node:crypto';

export type Vertical = 'commerce' | 'customer-ops' | 'services' | 'b2b';
export type ThreadStatus = 'open' | 'handed_off' | 'closed';
export type MessageDirection = 'in' | 'out';
export type FlaggedReason = 'jailbreak' | 'pii' | 'toxic';

export interface ProspectThread {
  id: string;
  sessionId: string;
  email: string | null;
  name: string | null;
  vertical: Vertical | null;
  status: ThreadStatus;
  utmSource: string | null;
  userAgent: string | null;
  createdAt: string;
  lastMessageAt: string;
}

export interface ProspectMessage {
  id: string;
  threadId: string;
  direction: MessageDirection;
  body: string;
  aiGenerated: boolean;
  tokensInput: number | null;
  tokensOutput: number | null;
  costMicros: number | null;
  flagged: FlaggedReason | null;
  createdAt: string;
}

export interface LlmUsageEntry {
  id: string;
  feature: string;
  model: string;
  tokensInput: number;
  tokensOutput: number;
  costMicros: number;
  refType: string | null;
  refId: string | null;
  createdAt: string;
}

interface Store {
  threads: Map<string, ProspectThread>;
  messages: ProspectMessage[];
  usage: LlmUsageEntry[];
}

declare global {
  // eslint-disable-next-line no-var
  var __conciergeStore: Store | undefined;
}

const store: Store = (globalThis.__conciergeStore ??= {
  threads: new Map(),
  messages: [],
  usage: [],
});

// — Threads ——————————————————————————————————————————————————————————————

export function findThreadBySession(sessionId: string): ProspectThread | undefined {
  for (const t of store.threads.values()) {
    if (t.sessionId === sessionId) return t;
  }
  return undefined;
}

export function getThread(id: string): ProspectThread | undefined {
  return store.threads.get(id);
}

export function listThreads(opts?: {
  status?: ThreadStatus;
  limit?: number;
}): ProspectThread[] {
  const arr = [...store.threads.values()];
  const filtered = opts?.status ? arr.filter((t) => t.status === opts.status) : arr;
  filtered.sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  );
  return opts?.limit ? filtered.slice(0, opts.limit) : filtered;
}

export function upsertThread(input: {
  sessionId: string;
  vertical?: Vertical | null;
  utmSource?: string | null;
  userAgent?: string | null;
}): ProspectThread {
  const existing = findThreadBySession(input.sessionId);
  const now = new Date().toISOString();
  if (existing) {
    if (input.vertical && !existing.vertical) existing.vertical = input.vertical;
    existing.lastMessageAt = now;
    return existing;
  }
  const fresh: ProspectThread = {
    id: randomUUID(),
    sessionId: input.sessionId,
    email: null,
    name: null,
    vertical: input.vertical ?? null,
    status: 'open',
    utmSource: input.utmSource ?? null,
    userAgent: input.userAgent ?? null,
    createdAt: now,
    lastMessageAt: now,
  };
  store.threads.set(fresh.id, fresh);
  return fresh;
}

export function updateThread(id: string, patch: Partial<ProspectThread>): ProspectThread | undefined {
  const t = store.threads.get(id);
  if (!t) return undefined;
  Object.assign(t, patch);
  return t;
}

// — Messages ——————————————————————————————————————————————————————————————

export function listMessages(threadId: string): ProspectMessage[] {
  return store.messages
    .filter((m) => m.threadId === threadId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function appendMessage(input: {
  threadId: string;
  direction: MessageDirection;
  body: string;
  aiGenerated?: boolean;
  tokensInput?: number;
  tokensOutput?: number;
  costMicros?: number;
  flagged?: FlaggedReason | null;
}): ProspectMessage {
  const msg: ProspectMessage = {
    id: randomUUID(),
    threadId: input.threadId,
    direction: input.direction,
    body: input.body,
    aiGenerated: input.aiGenerated ?? false,
    tokensInput: input.tokensInput ?? null,
    tokensOutput: input.tokensOutput ?? null,
    costMicros: input.costMicros ?? null,
    flagged: input.flagged ?? null,
    createdAt: new Date().toISOString(),
  };
  store.messages.push(msg);
  const t = store.threads.get(input.threadId);
  if (t) t.lastMessageAt = msg.createdAt;
  return msg;
}

// — LLM usage ledger ——————————————————————————————————————————————————————

export function recordUsage(input: {
  feature: string;
  model: string;
  tokensInput: number;
  tokensOutput: number;
  costMicros: number;
  refType?: string;
  refId?: string;
}): LlmUsageEntry {
  const entry: LlmUsageEntry = {
    id: randomUUID(),
    feature: input.feature,
    model: input.model,
    tokensInput: input.tokensInput,
    tokensOutput: input.tokensOutput,
    costMicros: input.costMicros,
    refType: input.refType ?? null,
    refId: input.refId ?? null,
    createdAt: new Date().toISOString(),
  };
  store.usage.push(entry);
  return entry;
}

export function listUsage(limit?: number): LlmUsageEntry[] {
  const sorted = [...store.usage].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

// — Aggregations for the admin overview ——————————————————————————————————

export interface OverviewKpis {
  totalThreads: number;
  openThreads: number;
  handedOffThreads: number;
  totalMessages: number;
  aiMessages: number;
  totalTokensInput: number;
  totalTokensOutput: number;
  totalCostMicros: number;
  threadsLast24h: number;
  threadsLast7d: number;
  flaggedJailbreakCount: number;
}

export function computeOverviewKpis(): OverviewKpis {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const threads = [...store.threads.values()];
  const aiMsgs = store.messages.filter((m) => m.aiGenerated);
  const flagged = store.messages.filter((m) => m.flagged === 'jailbreak');

  return {
    totalThreads: threads.length,
    openThreads: threads.filter((t) => t.status === 'open').length,
    handedOffThreads: threads.filter((t) => t.status === 'handed_off').length,
    totalMessages: store.messages.length,
    aiMessages: aiMsgs.length,
    totalTokensInput: aiMsgs.reduce((sum, m) => sum + (m.tokensInput ?? 0), 0),
    totalTokensOutput: aiMsgs.reduce((sum, m) => sum + (m.tokensOutput ?? 0), 0),
    totalCostMicros: aiMsgs.reduce((sum, m) => sum + (m.costMicros ?? 0), 0),
    threadsLast24h: threads.filter((t) => now - new Date(t.createdAt).getTime() < day).length,
    threadsLast7d: threads.filter((t) => now - new Date(t.createdAt).getTime() < 7 * day).length,
    flaggedJailbreakCount: flagged.length,
  };
}

// — Cost helpers ——————————————————————————————————————————————————————————

// Gemini 2.5 Flash pricing (USD per 1M tokens, approximate; verify with current Google pricing).
// Stored as micros (millionths of a USD) for integer math.
const FLASH_PRICE_INPUT_PER_TOKEN_MICROS = 0.075; // $0.075 / 1M tokens = 0.075 micros/token
const FLASH_PRICE_OUTPUT_PER_TOKEN_MICROS = 0.3; // $0.30 / 1M tokens = 0.3 micros/token

export function computeCostMicros(tokensInput: number, tokensOutput: number): number {
  return Math.round(
    tokensInput * FLASH_PRICE_INPUT_PER_TOKEN_MICROS +
      tokensOutput * FLASH_PRICE_OUTPUT_PER_TOKEN_MICROS,
  );
}

export function microsToTHB(micros: number, usdToThb = 36): string {
  const thb = (micros / 1_000_000) * usdToThb;
  if (thb < 0.01) return '<฿0.01';
  return `฿${thb.toFixed(2)}`;
}

export function microsToUSD(micros: number): string {
  const usd = micros / 1_000_000;
  if (usd < 0.0001) return '<$0.0001';
  return `$${usd.toFixed(4)}`;
}
