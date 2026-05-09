import { NextResponse } from 'next/server';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { recordAction } from '@/lib/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const { orgId, user } = await requireMembership();

  const admin = createAdminClient();
  await admin
    .from('reply_templates')
    .update({ archived: true, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('org_id', orgId);

  await recordAction({
    orgId,
    actorType: 'user',
    actorUserId: user.id,
    action: 'template.archive',
    resourceKind: 'template',
    resourceId: id,
  });

  return NextResponse.redirect(new URL('/admin/templates', req.url));
}
