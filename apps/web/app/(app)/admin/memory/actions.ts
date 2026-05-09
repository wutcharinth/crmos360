'use server';

import { revalidatePath } from 'next/cache';
import { requireMembership } from '@/lib/auth/current-user';
import { runDailyLifecycle } from '@/lib/ai/memory-engine';
import { detectPromotionCandidates } from '@/lib/ai/memory-promote';
import { recordAction } from '@/lib/audit';

export async function runLifecycleAction(): Promise<void> {
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') return;

  const result = await runDailyLifecycle(orgId);
  await recordAction({
    orgId,
    actorType: 'user',
    actorUserId: user.id,
    action: 'memory.lifecycle.manual',
    resourceKind: 'org',
    resourceId: orgId,
    metadata: result,
  });

  revalidatePath('/admin/memory');
}

export async function runPromotionAction(): Promise<void> {
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') return;

  const inserted = await detectPromotionCandidates(orgId);
  await recordAction({
    orgId,
    actorType: 'user',
    actorUserId: user.id,
    action: 'memory.promotion.manual',
    resourceKind: 'org',
    resourceId: orgId,
    metadata: { inserted },
  });

  revalidatePath('/admin/memory');
}
