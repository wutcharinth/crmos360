import { NextResponse } from 'next/server';
import { requireMembership } from '@/lib/auth/current-user';
import { queryAudit, recordAction, type ActorType } from '@/lib/audit';

/**
 * Export audit log as CSV or JSONL. Admin-only.
 *
 * Query params:
 *   format=csv|jsonl  (default csv)
 *   actorType=user|ai|system
 *   action=...
 *   from=ISO  to=ISO
 *   limit=200..5000
 */
export async function GET(req: Request) {
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') {
    return NextResponse.json({ error: 'admin only' }, { status: 403 });
  }

  const url = new URL(req.url);
  const format = (url.searchParams.get('format') ?? 'csv').toLowerCase();
  const actorType = url.searchParams.get('actorType') as ActorType | null;
  const action = url.searchParams.get('action');
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') ?? 1000), 1), 5000);

  const entries = await queryAudit({
    orgId,
    actorType: actorType ?? undefined,
    action: action ?? undefined,
    fromDate: from ?? undefined,
    toDate: to ?? undefined,
    limit,
  });

  await recordAction({
    orgId,
    actorType: 'user',
    actorUserId: user.id,
    action: 'audit.export',
    metadata: { format, count: entries.length, filters: { actorType, action, from, to } },
  });

  const filename = `flowaios-audit-${new Date().toISOString().slice(0, 10)}.${format === 'jsonl' ? 'jsonl' : 'csv'}`;

  if (format === 'jsonl') {
    const body = entries
      .map((e) =>
        JSON.stringify({
          id: e.id,
          createdAt: e.createdAt,
          actorType: e.actorType,
          actorUserId: e.actorUserId,
          action: e.action,
          resourceKind: e.resourceKind,
          resourceId: e.resourceId,
          metadata: e.metadata,
        }),
      )
      .join('\n');
    return new Response(body, {
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  }

  // CSV
  const headers = ['id', 'created_at', 'actor_type', 'actor_user_id', 'action', 'resource_kind', 'resource_id', 'metadata'];
  const rows: string[] = [headers.join(',')];
  for (const e of entries) {
    rows.push(
      [
        csvEscape(e.id),
        csvEscape(e.createdAt),
        csvEscape(e.actorType),
        csvEscape(e.actorUserId ?? ''),
        csvEscape(e.action),
        csvEscape(e.resourceKind ?? ''),
        csvEscape(e.resourceId ?? ''),
        csvEscape(JSON.stringify(e.metadata)),
      ].join(','),
    );
  }
  return new Response(rows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

function csvEscape(v: string): string {
  if (v.includes(',') || v.includes('"') || v.includes('\n')) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}
