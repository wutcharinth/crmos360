import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireMembership } from '@/lib/auth/current-user';
import { recordAction } from '@/lib/audit';
import { getPdpaSettings, updatePdpaSettings } from '@/lib/pdpa';

const PatchSchema = z.object({
  residency: z.enum(['th', 'sg', 'eu']).optional(),
  memoryMode: z.enum(['auto', 'approval', 'manual']).optional(),
  memoryRetentionDays: z.number().int().min(1).max(3650).optional(),
  inboxRetentionDays: z.number().int().min(1).max(3650).optional(),
  auditRetentionDays: z.number().int().min(1).max(3650).optional(),
});

export async function GET() {
  const { orgId } = await requireMembership();
  const settings = await getPdpaSettings(orgId);
  return NextResponse.json(settings);
}

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
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'invalid input' },
      { status: 400 },
    );
  }

  const next = await updatePdpaSettings(orgId, parsed.data);
  await recordAction({
    orgId,
    actorType: 'user',
    actorUserId: user.id,
    action: 'pdpa.update',
    resourceKind: 'org_pdpa_settings',
    resourceId: orgId,
    metadata: parsed.data,
  });

  return NextResponse.json(next);
}
