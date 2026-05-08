import { requireMembership } from '@/lib/auth/current-user';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InviteForm } from './invite-form';
import { revokeInviteAction, removeMemberAction } from './actions';

export default async function TeamPage() {
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') redirect('/inbox');

  const admin = createAdminClient();

  const [{ data: members }, { data: invites }] = await Promise.all([
    admin
      .from('org_members')
      .select('user_id, role, created_at, user_profiles:user_profiles!inner(email, full_name)')
      .eq('org_id', orgId),
    admin
      .from('org_invites')
      .select('id, email, role, created_at, expires_at, accepted_at')
      .eq('org_id', orgId)
      .is('accepted_at', null),
  ]);

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Invite a teammate</CardTitle>
          <CardDescription>They&apos;ll get a link to join this workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <InviteForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {(members ?? []).map((m) => {
              const profile = m.user_profiles as unknown as
                | { email: string; full_name: string | null }
                | null;
              return (
                <li key={m.user_id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{profile?.full_name ?? profile?.email}</p>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm capitalize text-muted-foreground">{m.role}</span>
                    {role === 'owner' && m.user_id !== user.id && (
                      <form action={removeMemberAction.bind(null, m.user_id)}>
                        <button className="text-sm text-destructive hover:underline">Remove</button>
                      </form>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      {invites && invites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending invites</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {invites.map((inv) => (
                <li key={inv.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{inv.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {inv.role} · expires {new Date(inv.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                  <form action={revokeInviteAction.bind(null, inv.id)}>
                    <button className="text-sm text-destructive hover:underline">Revoke</button>
                  </form>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
