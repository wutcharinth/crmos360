import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Append an entry to the audit_logs table. Used by every AI subsystem
 * + admin action that affects org data.
 *
 * Failures are swallowed (logged to console) so that audit-write hiccups
 * do not block business logic. The audit log is a record, not a gate.
 */

export type ActorType = 'user' | 'ai' | 'system';

export interface RecordActionArgs {
  orgId: string;
  actorType: ActorType;
  /** Set when actorType = 'user'; null otherwise. */
  actorUserId?: string | null;
  /** Verb-shaped: 'message.send' / 'lesson.approve' / 'pdpa.update' etc. */
  action: string;
  resourceKind?: string;
  resourceId?: string | null;
  /** Free-form payload; goes into `metadata` jsonb. */
  metadata?: Record<string, unknown>;
}

export async function recordAction(args: RecordActionArgs): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from('audit_logs').insert({
      org_id: args.orgId,
      actor_type: args.actorType,
      actor_user_id: args.actorType === 'user' ? args.actorUserId ?? null : null,
      action: args.action.slice(0, 100),
      target_kind: args.resourceKind ?? null,
      target_id: args.resourceId ?? null,
      metadata: args.metadata ?? {},
    });
  } catch (err) {
    console.warn('[audit] recordAction failed', { action: args.action, err });
  }
}

export interface AuditQueryFilter {
  orgId: string;
  actorType?: ActorType;
  action?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
}

export interface AuditEntry {
  id: string;
  actorType: ActorType;
  actorUserId: string | null;
  action: string;
  resourceKind: string | null;
  resourceId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export async function queryAudit(filter: AuditQueryFilter): Promise<AuditEntry[]> {
  const admin = createAdminClient();
  let q = admin
    .from('audit_logs')
    .select('id, actor_type, actor_user_id, action, target_kind, target_id, metadata, created_at')
    .eq('org_id', filter.orgId)
    .order('created_at', { ascending: false })
    .limit(filter.limit ?? 200);

  if (filter.actorType) q = q.eq('actor_type', filter.actorType);
  if (filter.action) q = q.eq('action', filter.action);
  if (filter.fromDate) q = q.gte('created_at', filter.fromDate);
  if (filter.toDate) q = q.lte('created_at', filter.toDate);

  const { data } = await q;
  return ((data ?? []) as Record<string, unknown>[]).map((r) => ({
    id: r.id as string,
    actorType: (r.actor_type as ActorType) ?? 'user',
    actorUserId: (r.actor_user_id as string | null) ?? null,
    action: r.action as string,
    resourceKind: (r.target_kind as string | null) ?? null,
    resourceId: (r.target_id as string | null) ?? null,
    metadata: (r.metadata as Record<string, unknown>) ?? {},
    createdAt: r.created_at as string,
  }));
}
