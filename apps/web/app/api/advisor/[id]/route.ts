import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireMembership } from '@/lib/auth/current-user';
import { approveRule, rejectRule } from '@/lib/ai/advisor';

const Schema = z.object({ action: z.enum(['approve', 'reject']) });

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { user, role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') {
    return NextResponse.json({ error: 'admin only' }, { status: 403 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid input' }, { status: 400 });
  }
  const ok =
    parsed.data.action === 'approve'
      ? await approveRule(id, user.id)
      : await rejectRule(id, user.id);
  return NextResponse.json({ ok });
}
