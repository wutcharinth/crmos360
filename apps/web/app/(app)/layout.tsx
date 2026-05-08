import Link from 'next/link';
import { requireMembership } from '@/lib/auth/current-user';
import { Button } from '@/components/ui/button';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { orgName, role, user } = await requireMembership();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-4">
          <Link href="/inbox" className="font-semibold">
            CRMOS360
          </Link>
          <span className="text-sm text-muted-foreground">/ {orgName}</span>
          <nav className="ml-4 flex items-center gap-3 text-sm">
            <Link href="/inbox" className="text-muted-foreground hover:text-foreground">
              Inbox
            </Link>
            {(role === 'owner' || role === 'admin') && (
              <Link href="/admin/team" className="text-muted-foreground hover:text-foreground">
                Team
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <form action="/auth/sign-out" method="post">
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
