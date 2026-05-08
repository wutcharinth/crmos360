import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from './profile-form';

export const dynamic = 'force-dynamic';

export default async function ProfileSettingsPage() {
  const { user } = await requireMembership();

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('user_profiles')
    .select('id, email, full_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Your profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          How others on your team see you.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
          <CardDescription>Name and email used across FlowAIOS.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            initial={{
              email: profile?.email ?? user.email ?? '',
              fullName: profile?.full_name ?? '',
              avatarUrl: profile?.avatar_url ?? '',
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="font-medium">{user.email}</span>.
          </p>
          <form action="/auth/sign-out" method="post" className="mt-3">
            <button className="text-sm text-destructive hover:underline">Sign out</button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
