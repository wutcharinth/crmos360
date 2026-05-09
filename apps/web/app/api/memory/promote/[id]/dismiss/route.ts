import { NextResponse } from 'next/server';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { recordAction } from '@/lib/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') {
    return NextResponse.redirect(new URL('/admin/memory', req.url));
  }

  const admin = createAdminClient();
  await admin
    .from('memory_promotions')
    .update({
      status: 'dismissed',
      reviewed_at: new Date().toISOString(),
      reviewed_by_user_id: user.id,
    })
    .eq('id', id)
    .eq('org_id', orgId);

  await recordAction({
    orgId,
    actorType: 'user',
    actorUserId: user.id,
    action: 'memory.promotion.dismiss',
    resourceKind: 'memory_promotion',
    resourceId: id,
    metadata: {},
  });

  return NextResponse.redirect(new URL('/admin/memory', req.url));
}
