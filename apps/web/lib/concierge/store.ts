/**
 * Prospect-thread store for the marketing concierge chatbot.
 *
 * Hybrid: Supabase when configured (production / staging / dev with creds),
 * in-memory Map otherwise (CI, no-env smoke tests). All functions are async
 * regardless of backend so the calling surface doesn't have to know.
 *
 * Tables:
 *   prospect_threads (RLS DISABLED — service-role only)
 *   prospect_messages (RLS DISABLED — service-role only)
 *   llm_usage (RLS ON — org-admin scoped, service-role for org_id IS NULL)
 *
 * Migration: supabase/migrations/20260510120000_concierge_prospects_llm_usage.sql
 */
import { randomUUID } from 'node:crypto';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

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

interface MemStore {
  threads: Map<string, ProspectThread>;
  messages: ProspectMessage[];
  usage: LlmUsageEntry[];
}

declare global {
  // eslint-disable-next-line no-var
  var __conciergeStore: MemStore | undefined;
}

const mem: MemStore = (globalThis.__conciergeStore ??= {
  threads: new Map(),
  messages: [],
  usage: [],
});

const supabaseEnabled = (): boolean => isSupabaseConfigured();

// — Row mappers —————————————————————————————————————————————————————————————

function rowToThread(r: Record<string, unknown>): ProspectThread {
  return {
    id: r.id as string,
    sessionId: r.session_id as string,
    email: (r.email as string | null) ?? null,
    name: (r.name as string | null) ?? null,
    vertical: (r.vertical as Vertical | null) ?? null,
    status: (r.status as ThreadStatus) ?? 'open',
    utmSource: (r.utm_source as string | null) ?? null,
    userAgent: (r.user_agent as string | null) ?? null,
    createdAt: r.created_at as string,
    lastMessageAt: r.last_message_at as string,
  };
}

function rowToMessage(r: Record<string, unknown>): ProspectMessage {
  return {
    id: r.id as string,
    threadId: r.thread_id as string,
    direction: r.direction as MessageDirection,
    body: r.body as string,
    aiGenerated: Boolean(r.ai_generated),
    tokensInput: (r.tokens_input as number | null) ?? null,
    tokensOutput: (r.tokens_output as number | null) ?? null,
    costMicros: (r.cost_micros as number | null) ?? null,
    flagged: (r.flagged as FlaggedReason | null) ?? null,
    createdAt: r.created_at as string,
  };
}

function rowToUsage(r: Record<string, unknown>): LlmUsageEntry {
  return {
    id: r.id as string,
    feature: r.feature as string,
    model: r.model as string,
    tokensInput: Number(r.tokens_input ?? 0),
    tokensOutput: Number(r.tokens_output ?? 0),
    costMicros: Number(r.cost_micros ?? 0),
    refType: (r.ref_type as string | null) ?? null,
    refId: (r.ref_id as string | null) ?? null,
    createdAt: r.created_at as string,
  };
}

// — Threads ——————————————————————————————————————————————————————————————

export async function findThreadBySession(sessionId: string): Promise<ProspectThread | undefined> {
  if (supabaseEnabled()) {
    const admin = createAdminClient();
    const { data } = await admin
      .from('prospect_threads')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();
    return data ? rowToThread(data) : undefined;
  }
  for (const t of mem.threads.values()) if (t.sessionId === sessionId) return t;
  return undefined;
}

export async function getThread(id: string): Promise<ProspectThread | undefined> {
  if (supabaseEnabled()) {
    const admin = createAdminClient();
    const { data } = await admin.from('prospect_threads').select('*').eq('id', id).maybeSingle();
    return data ? rowToThread(data) : undefined;
  }
  return mem.threads.get(id);
}

export async function listThreads(opts?: {
  status?: ThreadStatus;
  limit?: number;
}): Promise<ProspectThread[]> {
  if (supabaseEnabled()) {
    const admin = createAdminClient();
    let q = admin
      .from('prospect_threads')
      .select('*')
      .order('last_message_at', { ascending: false })
      .limit(opts?.limit ?? 100);
    if (opts?.status) q = q.eq('status', opts.status);
    const { data } = await q;
    return (data ?? []).map(rowToThread);
  }
  const arr = [...mem.threads.values()];
  const filtered = opts?.status ? arr.filter((t) => t.status === opts.status) : arr;
  filtered.sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  );
  return opts?.limit ? filtered.slice(0, opts.limit) : filtered;
}

export async function upsertThread(input: {
  sessionId: string;
  vertical?: Vertical | null;
  utmSource?: string | null;
  userAgent?: string | null;
}): Promise<ProspectThread> {
  if (supabaseEnabled()) {
    const admin = createAdminClient();
    const existing = await findThreadBySession(input.sessionId);
    const now = new Date().toISOString();
    if (existing) {
      const patch: Record<string, unknown> = { last_message_at: now };
      if (input.vertical && !existing.vertical) patch.vertical = input.vertical;
      const { data } = await admin
        .from('prospect_threads')
        .update(patch)
        .eq('id', existing.id)
        .select('*')
        .single();
      return rowToThread(data ?? {});
    }
    const { data } = await admin
      .from('prospect_threads')
      .insert({
        session_id: input.sessionId,
        vertical: input.vertical ?? null,
        utm_source: input.utmSource ?? null,
        user_agent: input.userAgent ?? null,
        status: 'open',
      })
      .select('*')
      .single();
    if (!data) throw new Error('failed to insert prospect_thread');
    return rowToThread(data);
  }

  const existing = await findThreadBySession(input.sessionId);
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
  mem.threads.set(fresh.id, fresh);
  return fresh;
}

export async function updateThread(
  id: string,
  patch: Partial<ProspectThread>,
): Promise<ProspectThread | undefined> {
  if (supabaseEnabled()) {
    const admin = createAdminClient();
    const dbPatch: Record<string, unknown> = {};
    if (patch.email !== undefined) dbPatch.email = patch.email;
    if (patch.name !== undefined) dbPatch.name = patch.name;
    if (patch.vertical !== undefined) dbPatch.vertical = patch.vertical;
    if (patch.status !== undefined) dbPatch.status = patch.status;
    if (Object.keys(dbPatch).length === 0) return await getThread(id);
    const { data } = await admin
      .from('prospect_threads')
      .update(dbPatch)
      .eq('id', id)
      .select('*')
      .maybeSingle();
    return data ? rowToThread(data) : undefined;
  }
  const t = mem.threads.get(id);
  if (!t) return undefined;
  Object.assign(t, patch);
  return t;
}

// — Messages ——————————————————————————————————————————————————————————————

export async function listMessages(threadId: string): Promise<ProspectMessage[]> {
  if (supabaseEnabled()) {
    const admin = createAdminClient();
    const { data } = await admin
      .from('prospect_messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });
    return (data ?? []).map(rowToMessage);
  }
  return mem.messages
    .filter((m) => m.threadId === threadId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function appendMessage(input: {
  threadId: string;
  direction: MessageDirection;
  body: string;
  aiGenerated?: boolean;
  tokensInput?: number;
  tokensOutput?: number;
  costMicros?: number;
  flagged?: FlaggedReason | null;
}): Promise<ProspectMessage> {
  if (supabaseEnabled()) {
    const admin = createAdminClient();
    const { data } = await admin
      .from('prospect_messages')
      .insert({
        thread_id: input.threadId,
        direction: input.direction,
        body: input.body,
        ai_generated: input.aiGenerated ?? false,
        tokens_input: input.tokensInput ?? null,
        tokens_output: input.tokensOutput ?? null,
        cost_micros: input.costMicros ?? null,
        flagged: input.flagged ?? null,
      })
      .select('*')
      .single();
    if (!data) throw new Error('failed to insert prospect_message');
    // Bump the thread's last_message_at for fast list queries.
    await admin
      .from('prospect_threads')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', input.threadId);
    return rowToMessage(data);
  }

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
  mem.messages.push(msg);
  const t = mem.threads.get(input.threadId);
  if (t) t.lastMessageAt = msg.createdAt;
  return msg;
}

// — LLM usage ledger ——————————————————————————————————————————————————————

export async function recordUsage(input: {
  feature: string;
  model: string;
  tokensInput: number;
  tokensOutput: number;
  costMicros: number;
  refType?: string;
  refId?: string;
  orgId?: string | null;
}): Promise<LlmUsageEntry> {
  if (supabaseEnabled()) {
    const admin = createAdminClient();
    const { data } = await admin
      .from('llm_usage')
      .insert({
        org_id: input.orgId ?? null,
        feature: input.feature,
        model: input.model,
        tokens_input: input.tokensInput,
        tokens_output: input.tokensOutput,
        cost_micros: input.costMicros,
        ref_type: input.refType ?? null,
        ref_id: input.refId ?? null,
      })
      .select('*')
      .single();
    if (!data) throw new Error('failed to insert llm_usage');
    return rowToUsage(data);
  }
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
  mem.usage.push(entry);
  return entry;
}

export async function listUsage(limit?: number): Promise<LlmUsageEntry[]> {
  if (supabaseEnabled()) {
    const admin = createAdminClient();
    const { data } = await admin
      .from('llm_usage')
      .select('*')
      .is('org_id', null) // concierge usage only here; org-scoped reads use a different path
      .order('created_at', { ascending: false })
      .limit(limit ?? 200);
    return (data ?? []).map(rowToUsage);
  }
  const sorted = [...mem.usage].sort(
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

export async function computeOverviewKpis(): Promise<OverviewKpis> {
  if (supabaseEnabled()) {
    const admin = createAdminClient();
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      { data: threads },
      { data: messages },
      { count: flaggedCount },
      { count: last24Count },
      { count: last7Count },
    ] = await Promise.all([
      admin.from('prospect_threads').select('id, status'),
      admin.from('prospect_messages').select('id, ai_generated, tokens_input, tokens_output, cost_micros'),
      admin.from('prospect_messages').select('*', { count: 'exact', head: true }).eq('flagged', 'jailbreak'),
      admin.from('prospect_threads').select('*', { count: 'exact', head: true }).gt('created_at', dayAgo),
      admin.from('prospect_threads').select('*', { count: 'exact', head: true }).gt('created_at', weekAgo),
    ]);

    const tt = threads ?? [];
    const mm = messages ?? [];
    const ai = mm.filter((m) => m.ai_generated);

    return {
      totalThreads: tt.length,
      openThreads: tt.filter((t) => t.status === 'open').length,
      handedOffThreads: tt.filter((t) => t.status === 'handed_off').length,
      totalMessages: mm.length,
      aiMessages: ai.length,
      totalTokensInput: ai.reduce((sum, m) => sum + Number(m.tokens_input ?? 0), 0),
      totalTokensOutput: ai.reduce((sum, m) => sum + Number(m.tokens_output ?? 0), 0),
      totalCostMicros: ai.reduce((sum, m) => sum + Number(m.cost_micros ?? 0), 0),
      threadsLast24h: last24Count ?? 0,
      threadsLast7d: last7Count ?? 0,
      flaggedJailbreakCount: flaggedCount ?? 0,
    };
  }

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const threads = [...mem.threads.values()];
  const aiMsgs = mem.messages.filter((m) => m.aiGenerated);
  const flaggedMsgs = mem.messages.filter((m) => m.flagged === 'jailbreak');

  return {
    totalThreads: threads.length,
    openThreads: threads.filter((t) => t.status === 'open').length,
    handedOffThreads: threads.filter((t) => t.status === 'handed_off').length,
    totalMessages: mem.messages.length,
    aiMessages: aiMsgs.length,
    totalTokensInput: aiMsgs.reduce((sum, m) => sum + (m.tokensInput ?? 0), 0),
    totalTokensOutput: aiMsgs.reduce((sum, m) => sum + (m.tokensOutput ?? 0), 0),
    totalCostMicros: aiMsgs.reduce((sum, m) => sum + (m.costMicros ?? 0), 0),
    threadsLast24h: threads.filter((t) => now - new Date(t.createdAt).getTime() < day).length,
    threadsLast7d: threads.filter((t) => now - new Date(t.createdAt).getTime() < 7 * day).length,
    flaggedJailbreakCount: flaggedMsgs.length,
  };
}

// — Cost helpers (pure — unchanged) ————————————————————————————————————————

const FLASH_PRICE_INPUT_PER_TOKEN_MICROS = 0.075;
const FLASH_PRICE_OUTPUT_PER_TOKEN_MICROS = 0.3;

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
