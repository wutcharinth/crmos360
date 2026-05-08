import { requireMembership } from '@/lib/auth/current-user';

export default async function InboxPage() {
  const { orgName } = await requireMembership();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Inbox</h1>
      <p className="mt-2 text-muted-foreground">
        {orgName} — conversations will appear here once a channel is connected.
      </p>
      <div className="mt-6 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No conversations yet. (Milestone 1.2 wires up LINE OA.)
      </div>
    </main>
  );
}
