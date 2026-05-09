import { NextResponse } from 'next/server';
import { requireMembership } from '@/lib/auth/current-user';
import { manuallySetMemoryStatus } from '@/lib/ai/memory-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handle(req: Request, params: Promise<{ id: string }>, status: 'archived' | 'active') {
  const { id } = await params;
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') {
    return NextResponse.redirect(new URL('/admin/memory', req.url));
  }
  await manuallySetMemoryStatus({
    orgId,
    memoryId: id,
    status,
    actorUserId: user.id,
  });
  return NextResponse.redirect(new URL('/admin/memory', req.url));
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(req, ctx.params, 'archived');
}
