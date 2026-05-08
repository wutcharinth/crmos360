import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

const ACTION_LABEL: Record<string, string> = {
  'integration.line.saved': 'LINE integration saved',
  'integration.line.disconnected': 'LINE integration disconnected',
  'conversation.updated': 'Conversation updated',
  'invite.sent': 'Invite sent',
  'invite.revoked': 'Invite revoked',
  'member.removed': 'Member removed',
};

export default async function AuditPage() {
  const { orgId, role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') redirect('/dashboard');

  const admin = createAdminClient();

  const { data: rows } = await admin
    .from('audit_logs')
    .select('id, action, target_kind, target_id, metadata, created_at, actor_user_id')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(200);

  const actorIds = [...new Set((rows ?? []).map((r) => r.actor_user_id).filter(Boolean) as string[])];
  const { data: profiles } = actorIds.length
    ? await admin.from('user_profiles').select('id, email, full_name').in('id', actorIds)
    : { data: [] as { id: string; email: string; full_name: string | null }[] };

  const profileById = new Map(
    (profiles ?? []).map((p) => [p.id, p as { id: string; email: string; full_name: string | null }]),
  );

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Audit log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Recent admin and system actions in this workspace.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Latest events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!rows || rows.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No events yet.</p>
          ) : (
            <ul className="divide-y">
              {rows.map((r) => {
                const actor = r.actor_user_id ? profileById.get(r.actor_user_id) : null;
                const meta = (r.metadata ?? {}) as Record<string, unknown>;
                return (
                  <li key={r.id} className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {ACTION_LABEL[r.action] ?? r.action}
                        </span>
                        {r.target_kind === 'conversation' && r.target_id && (
                          <Link
                            href={`/inbox/${r.target_id}`}
                            className="font-mono text-xs text-warm hover:underline"
                          >
                            #{r.target_id.slice(0, 8)}
                          </Link>
                        )}
                      </div>
                      <time className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </time>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>by {actor?.full_name ?? actor?.email ?? 'system'}</span>
                      {Object.keys(meta).length > 0 && (
                        <code className="font-mono text-[10px]">
                          {JSON.stringify(meta).slice(0, 80)}
                        </code>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
