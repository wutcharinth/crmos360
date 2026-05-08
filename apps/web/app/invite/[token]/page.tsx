import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { acceptInviteAction } from './actions';
import { AcceptButton } from './accept-button';

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const admin = createAdminClient();
  const { data: invite } = await admin
    .from('org_invites')
    .select('email, role, accepted_at, expires_at, organizations:organizations!inner(name)')
    .eq('token', token)
    .maybeSingle();

  if (!invite) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invite not found</CardTitle>
            <CardDescription>The link may be incorrect or already used.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  if (invite.accepted_at) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invite already used</CardTitle>
            <CardDescription>This invite has been accepted.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/inbox">Go to inbox</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (new Date(invite.expires_at).getTime() < Date.now()) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invite expired</CardTitle>
            <CardDescription>Ask your admin to send a new invite.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/invite/${token}`)}`);
  }

  const orgName =
    (invite.organizations as unknown as { name: string } | null)?.name ?? 'this workspace';

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join {orgName}</CardTitle>
          <CardDescription>
            You were invited as <span className="font-medium">{invite.role}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AcceptButton token={token} action={acceptInviteAction} />
        </CardContent>
      </Card>
    </main>
  );
}
