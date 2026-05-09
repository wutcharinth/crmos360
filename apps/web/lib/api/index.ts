/**
 * Server-side data access for in-app surfaces.
 *
 * Each function branches on `NEXT_PUBLIC_USE_MOCKS`:
 *   - "1" → return fixture data from lib/mocks/fixtures/
 *   - else → run the real Supabase query
 *
 * New M1.5 surfaces (knowledge / intelligence / advisor / pdpa) currently
 * have no Supabase tables; the non-mock path throws until Phase 5 wires
 * the migrations. Existing surfaces (inbox / customers) fall through to
 * the real query.
 */

import { conversations as mockConversations, findConversation } from '../mocks/fixtures/conversations';
import { customers as mockCustomers, findCustomer } from '../mocks/fixtures/customers';
import { lessons as mockLessons, findLesson } from '../mocks/fixtures/lessons';
import { dashboardMetrics as mockDashboard } from '../mocks/fixtures/dashboard';
import { advisorRules as mockRules, findRule } from '../mocks/fixtures/advisor-rules';
import { auditLog as mockAudit } from '../mocks/fixtures/audit-log';
import type {
  MockConversation,
  MockCustomer,
  MockLesson,
  MockDashboardMetrics,
  MockAdvisorRule,
  MockAuditLogEntry,
} from '../mocks/types';

export const useMocks = (): boolean => process.env.NEXT_PUBLIC_USE_MOCKS === '1';

const notImplemented = (surface: string): never => {
  throw new Error(
    `[api/${surface}] No real implementation yet. Set NEXT_PUBLIC_USE_MOCKS=1 to use fixture data, or wait for Phase 5 to land migrations.`,
  );
};

// — Conversations ——————————————————————————————————————————————————————————————

export async function listConversations(filter?: {
  status?: string;
  channel?: string;
  vertical?: string;
}): Promise<MockConversation[]> {
  if (!useMocks()) return notImplemented('conversations');
  let rows = [...mockConversations];
  if (filter?.status && filter.status !== 'all') {
    rows = rows.filter((c) => c.status === filter.status);
  }
  if (filter?.channel) {
    rows = rows.filter((c) => c.channel === filter.channel);
  }
  if (filter?.vertical) {
    rows = rows.filter((c) => c.vertical === filter.vertical);
  }
  rows.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  return rows;
}

export async function getConversation(id: string): Promise<MockConversation | null> {
  if (!useMocks()) return notImplemented('conversations');
  return findConversation(id) ?? null;
}

// — Customers ——————————————————————————————————————————————————————————————

export async function getCustomer(id: string): Promise<MockCustomer | null> {
  if (!useMocks()) return notImplemented('customers');
  return findCustomer(id) ?? null;
}

export async function listCustomers(): Promise<MockCustomer[]> {
  if (!useMocks()) return notImplemented('customers');
  return [...mockCustomers].sort((a, b) => a.name.localeCompare(b.name, 'th'));
}

// — Lessons ——————————————————————————————————————————————————————————————

interface LessonRow {
  id: string;
  org_id: string;
  source_conversation_id: string | null;
  statement: string;
  reasoning: string;
  status: 'pending' | 'approved' | 'rejected';
  suggested_rule_jsonb: { condition: string; action: string } | null;
  created_at: string;
  approved_at: string | null;
}

function lessonRowToMock(row: LessonRow, approverName: string | null): MockLesson {
  return {
    id: row.id,
    orgId: row.org_id,
    statement: row.statement,
    reasoning: row.reasoning,
    sourceConversationId: row.source_conversation_id,
    status: row.status,
    suggestedRule: row.suggested_rule_jsonb,
    createdAt: row.created_at,
    approvedAt: row.approved_at,
    approvedByName: approverName,
  };
}

export async function listLessons(status?: 'pending' | 'approved' | 'rejected'): Promise<MockLesson[]> {
  if (useMocks()) {
    let rows = [...mockLessons];
    if (status) rows = rows.filter((l) => l.status === status);
    rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return rows;
  }

  // Real Supabase path — server-only callers (admin / app routes).
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const { requireMembership } = await import('@/lib/auth/current-user');
  const { orgId } = await requireMembership();
  const admin = createAdminClient();
  let q = admin
    .from('lessons')
    .select(
      'id, org_id, source_conversation_id, statement, reasoning, status, suggested_rule_jsonb, created_at, approved_at',
    )
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(200);
  if (status) q = q.eq('status', status);
  const { data } = await q;
  return ((data ?? []) as LessonRow[]).map((r) => lessonRowToMock(r, null));
}

export async function getLesson(id: string): Promise<MockLesson | null> {
  if (useMocks()) return findLesson(id) ?? null;

  const { createAdminClient } = await import('@/lib/supabase/admin');
  const { requireMembership } = await import('@/lib/auth/current-user');
  const { orgId } = await requireMembership();
  const admin = createAdminClient();
  const { data } = await admin
    .from('lessons')
    .select(
      'id, org_id, source_conversation_id, statement, reasoning, status, suggested_rule_jsonb, created_at, approved_at',
    )
    .eq('id', id)
    .eq('org_id', orgId)
    .maybeSingle();
  if (!data) return null;
  return lessonRowToMock(data as LessonRow, null);
}

// — Dashboard ——————————————————————————————————————————————————————————————

export async function getDashboardMetrics(): Promise<MockDashboardMetrics> {
  if (useMocks()) return mockDashboard;

  const { requireMembership } = await import('@/lib/auth/current-user');
  const { getOrgDashboard } = await import('@/lib/intelligence/compute');
  const { orgId } = await requireMembership();
  return getOrgDashboard(orgId);
}

// — Advisor rules ——————————————————————————————————————————————————————————————

export async function listAdvisorRules(status?: 'pending' | 'active' | 'disabled'): Promise<MockAdvisorRule[]> {
  if (!useMocks()) return notImplemented('advisor');
  let rows = [...mockRules];
  if (status) rows = rows.filter((r) => r.status === status);
  rows.sort((a, b) => b.appliedCount - a.appliedCount);
  return rows;
}

export async function getAdvisorRule(id: string): Promise<MockAdvisorRule | null> {
  if (!useMocks()) return notImplemented('advisor');
  return findRule(id) ?? null;
}

// — Audit log ——————————————————————————————————————————————————————————————

export async function listAuditLog(limit = 200): Promise<MockAuditLogEntry[]> {
  if (!useMocks()) return notImplemented('audit');
  return [...mockAudit]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
