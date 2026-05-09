import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  const { orgId } = await requireMembership();
  const url = new URL(req.url);
  const status = url.searchParams.get('status');

  const admin = createAdminClient();
  let q = admin
    .from('advisor_rules')
    .select(
      'id, name, condition_text, action_text, source, source_id, status, confidence, applied_count, last_applied_at, created_at',
    )
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(200);
  if (status) q = q.eq('status', status);
  const { data } = await q;
  return NextResponse.json({ rules: data ?? [] });
}

const PostSchema = z.object({
  name: z.string().min(1).max(120),
  conditionText: z.string().min(1).max(500),
  actionText: z.string().min(1).max(500),
  matchJsonb: z.record(z.unknown()),
  actionJsonb: z.record(z.unknown()),
  confidence: z.number().int().min(0).max(100).optional(),
});

export async function POST(req: Request) {
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') {
    return NextResponse.json({ error: 'admin only' }, { status: 403 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'invalid' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('advisor_rules')
    .insert({
      org_id: orgId,
      name: parsed.data.name,
      condition_text: parsed.data.conditionText,
      action_text: parsed.data.actionText,
      match_jsonb: parsed.data.matchJsonb,
      action_jsonb: parsed.data.actionJsonb,
      source: 'manual',
      source_id: user.id,
      status: 'pending',
      confidence: parsed.data.confidence ?? 50,
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
