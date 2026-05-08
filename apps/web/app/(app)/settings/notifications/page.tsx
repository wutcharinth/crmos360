import { requireMembership } from '@/lib/auth/current-user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  await requireMembership();

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Decide when FlowAIOS should ping you.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email digest</CardTitle>
          <CardDescription>Coming soon.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Toggle label="New conversation assigned to me" disabled />
          <Toggle label="Customer escalation" disabled />
          <Toggle label="Daily summary email" disabled />
          <p className="mt-2 text-xs text-muted-foreground">
            Email delivery is wired in a future milestone.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

function Toggle({ label, disabled }: { label: string; disabled?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border bg-background px-3 py-2.5">
      <span>{label}</span>
      <input type="checkbox" disabled={disabled} className="h-4 w-4" />
    </label>
  );
}
