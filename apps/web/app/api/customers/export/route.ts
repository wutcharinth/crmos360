import { NextResponse } from 'next/server';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { toCsv } from '@/lib/util/csv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const { orgId, role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('customers')
    .select('id, name, channel_ids, tags, created_at')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(10_000);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data ?? []).map((c) => {
    const ids = (c.channel_ids ?? {}) as Record<string, string>;
    return [
      c.id,
      c.name ?? '',
      ids.line ?? '',
      ids.messenger ?? '',
      ids.instagram ?? '',
      (c.tags ?? []).join('|'),
      c.created_at,
    ];
  });

  const header = ['id', 'name', 'line_id', 'messenger_id', 'instagram_id', 'tags', 'created_at'];
  const csv = toCsv([header, ...rows]);

  return new NextResponse(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="flowaios-customers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
