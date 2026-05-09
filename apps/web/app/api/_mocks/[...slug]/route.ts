import { NextResponse } from 'next/server';
import {
  listConversations,
  getConversation,
  listCustomers,
  getCustomer,
  listLessons,
  getLesson,
  getDashboardMetrics,
  listAdvisorRules,
  getAdvisorRule,
  listAuditLog,
  mocksEnabled,
} from '@/lib/api';

/**
 * Mock dispatcher for client-side fetches.
 * Routes:
 *   GET /api/_mocks/conversations[?status=&channel=&vertical=]
 *   GET /api/_mocks/conversations/:id
 *   GET /api/_mocks/customers[]
 *   GET /api/_mocks/customers/:id
 *   GET /api/_mocks/lessons[?status=]
 *   GET /api/_mocks/lessons/:id
 *   GET /api/_mocks/dashboard
 *   GET /api/_mocks/advisor[?status=]
 *   GET /api/_mocks/advisor/:id
 *   GET /api/_mocks/audit[?limit=]
 *
 * Disabled unless NEXT_PUBLIC_USE_MOCKS=1.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  if (!mocksEnabled()) {
    return NextResponse.json({ error: 'mocks disabled' }, { status: 404 });
  }

  const { slug } = await params;
  const [resource, id] = slug;
  const url = new URL(req.url);
  const sp = url.searchParams;

  try {
    switch (resource) {
      case 'conversations':
        if (id) {
          const conv = await getConversation(id);
          return conv
            ? NextResponse.json(conv)
            : NextResponse.json({ error: 'not found' }, { status: 404 });
        }
        return NextResponse.json(
          await listConversations({
            status: sp.get('status') ?? undefined,
            channel: sp.get('channel') ?? undefined,
            vertical: sp.get('vertical') ?? undefined,
          }),
        );

      case 'customers':
        if (id) {
          const cust = await getCustomer(id);
          return cust
            ? NextResponse.json(cust)
            : NextResponse.json({ error: 'not found' }, { status: 404 });
        }
        return NextResponse.json(await listCustomers());

      case 'lessons':
        if (id) {
          const lesson = await getLesson(id);
          return lesson
            ? NextResponse.json(lesson)
            : NextResponse.json({ error: 'not found' }, { status: 404 });
        }
        return NextResponse.json(
          await listLessons(
            (sp.get('status') as 'pending' | 'approved' | 'rejected' | null) ?? undefined,
          ),
        );

      case 'dashboard':
        return NextResponse.json(await getDashboardMetrics());

      case 'advisor':
        if (id) {
          const rule = await getAdvisorRule(id);
          return rule
            ? NextResponse.json(rule)
            : NextResponse.json({ error: 'not found' }, { status: 404 });
        }
        return NextResponse.json(
          await listAdvisorRules(
            (sp.get('status') as 'pending' | 'active' | 'disabled' | null) ?? undefined,
          ),
        );

      case 'audit': {
        const limit = sp.get('limit') ? Number(sp.get('limit')) : undefined;
        return NextResponse.json(await listAuditLog(limit));
      }

      default:
        return NextResponse.json({ error: `unknown resource: ${resource}` }, { status: 404 });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
