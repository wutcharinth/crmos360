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

export async function listLessons(status?: 'pending' | 'approved' | 'rejected'): Promise<MockLesson[]> {
  if (!useMocks()) return notImplemented('lessons');
  let rows = [...mockLessons];
  if (status) rows = rows.filter((l) => l.status === status);
  rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return rows;
}

export async function getLesson(id: string): Promise<MockLesson | null> {
  if (!useMocks()) return notImplemented('lessons');
  return findLesson(id) ?? null;
}

// — Dashboard ——————————————————————————————————————————————————————————————

export async function getDashboardMetrics(): Promise<MockDashboardMetrics> {
  if (!useMocks()) return notImplemented('dashboard');
  return mockDashboard;
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
