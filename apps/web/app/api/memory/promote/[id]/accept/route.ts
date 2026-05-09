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
  const { data: promotion } = await admin
    .from('memory_promotions')
    .select('id, pattern, customer_count, status')
    .eq('id', id)
    .eq('org_id', orgId)
    .maybeSingle();

  if (!promotion || promotion.status !== 'pending') {
    return NextResponse.redirect(new URL('/admin/memory', req.url));
  }

  // Insert as a lesson candidate. The lessons table is the org-wide
  // pattern store that the auto-reply pipeline already reads from.
  const { data: lesson } = await admin
    .from('lessons')
    .insert({
      org_id: orgId,
      statement: promotion.pattern,
      reasoning: `Promoted from ${promotion.customer_count} customer-level memories (memory_promotion).`,
      status: 'pending',
    })
    .select('id')
    .maybeSingle();

  await admin
    .from('memory_promotions')
    .update({
      status: 'accepted',
      reviewed_at: new Date().toISOString(),
      reviewed_by_user_id: user.id,
      promoted_to_lesson_id: lesson?.id ?? null,
    })
    .eq('id', id);

  await recordAction({
    orgId,
    actorType: 'user',
    actorUserId: user.id,
    action: 'memory.promotion.accept',
    resourceKind: 'memory_promotion',
    resourceId: id,
    metadata: { lesson_id: lesson?.id, pattern: promotion.pattern },
  });

  return NextResponse.redirect(new URL('/admin/memory', req.url));
}
