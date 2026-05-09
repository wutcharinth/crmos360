import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

export type Residency = 'th' | 'sg' | 'eu';
export type MemoryMode = 'auto' | 'approval' | 'manual';

export interface PdpaSettings {
  orgId: string;
  residency: Residency;
  memoryMode: MemoryMode;
  memoryRetentionDays: number;
  inboxRetentionDays: number;
  auditRetentionDays: number;
  dpaSignedAt: string | null;
}

const DEFAULT_SETTINGS: Omit<PdpaSettings, 'orgId'> = {
  residency: 'th',
  memoryMode: 'auto',
  memoryRetentionDays: 90,
  inboxRetentionDays: 365,
  auditRetentionDays: 365,
  dpaSignedAt: null,
};

/**
 * Read PDPA settings for an org. Returns defaults when the row doesn't
 * exist yet — the org_pdpa_settings table populates lazily on first
 * write.
 */
export async function getPdpaSettings(orgId: string): Promise<PdpaSettings> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('org_pdpa_settings')
    .select(
      'residency, memory_mode, memory_retention_days, inbox_retention_days, audit_retention_days, dpa_signed_at',
    )
    .eq('org_id', orgId)
    .maybeSingle();

  if (!data) return { orgId, ...DEFAULT_SETTINGS };

  return {
    orgId,
    residency: (data.residency as Residency) ?? DEFAULT_SETTINGS.residency,
    memoryMode: (data.memory_mode as MemoryMode) ?? DEFAULT_SETTINGS.memoryMode,
    memoryRetentionDays:
      (data.memory_retention_days as number) ?? DEFAULT_SETTINGS.memoryRetentionDays,
    inboxRetentionDays:
      (data.inbox_retention_days as number) ?? DEFAULT_SETTINGS.inboxRetentionDays,
    auditRetentionDays:
      (data.audit_retention_days as number) ?? DEFAULT_SETTINGS.auditRetentionDays,
    dpaSignedAt: (data.dpa_signed_at as string | null) ?? null,
  };
}

export interface PdpaUpdate {
  residency?: Residency;
  memoryMode?: MemoryMode;
  memoryRetentionDays?: number;
  inboxRetentionDays?: number;
  auditRetentionDays?: number;
  dpaSignedAt?: string | null;
}

/**
 * Upsert one or more PDPA fields. Returns the resulting row.
 * Caller MUST be an org admin (route handler enforces; RLS reinforces).
 */
export async function updatePdpaSettings(
  orgId: string,
  patch: PdpaUpdate,
): Promise<PdpaSettings> {
  const admin = createAdminClient();
  const camelToSnake: Record<keyof PdpaUpdate, string> = {
    residency: 'residency',
    memoryMode: 'memory_mode',
    memoryRetentionDays: 'memory_retention_days',
    inboxRetentionDays: 'inbox_retention_days',
    auditRetentionDays: 'audit_retention_days',
    dpaSignedAt: 'dpa_signed_at',
  };

  const row: Record<string, unknown> = { org_id: orgId, updated_at: new Date().toISOString() };
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) row[camelToSnake[k as keyof PdpaUpdate]] = v;
  }

  await admin
    .from('org_pdpa_settings')
    .upsert(row, { onConflict: 'org_id' });

  return getPdpaSettings(orgId);
}
