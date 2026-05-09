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
  const { data: pending } = await admin
    .from('pending_facts')
    .select('id, customer_id, kind, content, embedding, source_conversation_id, status')
    .eq('id', id)
    .eq('org_id', orgId)
    .maybeSingle();

  if (!pending || pending.status !== 'pending') {
    return NextResponse.redirect(new URL('/admin/memory', req.url));
  }

  await admin.from('customer_memory').insert({
    org_id: orgId,
    customer_id: pending.customer_id,
    kind: pending.kind,
    content: pending.content,
    embedding: pending.embedding,
    source_conversation_id: pending.source_conversation_id,
    confidence: 0.85,
    score: 0.85,
  });

  await admin
    .from('pending_facts')
    .update({
      status: 'approved',
      approved_by_user_id: user.id,
      approved_at: new Date().toISOString(),
    })
    .eq('id', id);

  await recordAction({
    orgId,
    actorType: 'user',
    actorUserId: user.id,
    action: 'memory.pending.approve',
    resourceKind: 'pending_fact',
    resourceId: id,
    metadata: { kind: pending.kind },
  });

  return NextResponse.redirect(new URL('/admin/memory', req.url));
}
