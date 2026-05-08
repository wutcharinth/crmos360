import Link from 'next/link';
import { requireMembership } from '@/lib/auth/current-user';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/app/user-menu';

export const dynamic = 'force-dynamic';

const mainLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/inbox', label: 'Inbox' },
  { href: '/customers', label: 'Customers' },
];

const adminLinks = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/team', label: 'Team' },
  { href: '/admin/integrations', label: 'Integrations' },
  { href: '/admin/knowledge', label: 'Knowledge' },
  { href: '/admin/ai-logs', label: 'AI Logs' },
  { href: '/admin/audit', label: 'Audit' },
  { href: '/admin/settings', label: 'Settings' },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { orgName, role, user } = await requireMembership();
  const isAdmin = role === 'owner' || role === 'admin';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-warm to-warm-2 font-mono text-[11px] font-bold text-paper">
                F
              </span>
              FlowAIOS
            </Link>
            <span className="text-sm text-muted-foreground">{orgName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/settings/profile">Settings</Link>
            </Button>
            <UserMenu email={user.email ?? ''} role={role} />
          </div>
        </div>
        <nav className="-mb-px flex items-center gap-1 overflow-x-auto px-6 pb-1.5 text-sm scrollbar-thin">
          {mainLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex-shrink-0 rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <>
              <span className="mx-2 h-4 w-px flex-shrink-0 bg-border" />
              {adminLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex-shrink-0 rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </>
          )}
        </nav>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
