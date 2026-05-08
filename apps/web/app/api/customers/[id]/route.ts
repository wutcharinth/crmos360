import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  name: z.string().max(120).nullable().optional(),
  tags: z.array(z.string().min(1).max(40)).max(20).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { orgId, user } = await requireMembership();

  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_patch' }, { status: 400 });
  }
  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: 'empty_patch' }, { status: 400 });
  }

  const admin = createAdminClient();
  const update: Record<string, unknown> = { ...parsed.data, updated_at: new Date().toISOString() };

  const { error } = await admin
    .from('customers')
    .update(update)
    .eq('id', id)
    .eq('org_id', orgId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await admin.from('audit_logs').insert({
    org_id: orgId,
    actor_user_id: user.id,
    action: 'customer.updated',
    target_kind: 'customer',
    target_id: id,
    metadata: parsed.data,
  });

  return NextResponse.json({ ok: true });
}
