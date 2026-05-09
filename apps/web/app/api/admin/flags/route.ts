import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireMembership } from '@/lib/auth/current-user';
import { setFlag, FLAG_M15 } from '@/lib/flags';
import { recordAction } from '@/lib/audit';

const Schema = z.object({
  flagKey: z.enum([FLAG_M15]),
  enabled: z.boolean(),
});

export async function PATCH(req: Request) {
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
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid input' }, { status: 400 });
  }

  await setFlag({
    orgId,
    key: parsed.data.flagKey,
    enabled: parsed.data.enabled,
    userId: user.id,
  });
  await recordAction({
    orgId,
    actorType: 'user',
    actorUserId: user.id,
    action: 'flag.set',
    resourceKind: 'org_feature_flag',
    resourceId: parsed.data.flagKey,
    metadata: { enabled: parsed.data.enabled },
  });

  return NextResponse.json({ ok: true });
}
