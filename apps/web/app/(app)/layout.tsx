import Link from 'next/link';
import { requireMembership } from '@/lib/auth/current-user';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import { isFlagEnabled, FLAG_M15 } from '@/lib/flags';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/app/user-menu';

interface DevContext {
  orgName: string;
  role: 'owner' | 'admin' | 'agent';
  user: { email: string };
}

const DEV_CONTEXT: DevContext = {
  orgName: 'Demo Org',
  role: 'owner',
  user: { email: 'dev@local' },
};

export const dynamic = 'force-dynamic';

const baseMainLinks = [{ href: '/inbox', label: 'Inbox' }];
const m15MainLinks = [
  { href: '/knowledge', label: 'Knowledge' },
  { href: '/intelligence', label: 'Intelligence' },
  { href: '/advisor', label: 'Advisor' },
];

const adminLinks = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/team', label: 'Team' },
  { href: '/admin/integrations', label: 'Integrations' },
  { href: '/admin/audit', label: 'Audit' },
  { href: '/admin/flags', label: 'Flags' },
];

const m15SettingsLinks = [
  { href: '/settings/appearance', label: 'Appearance' },
  { href: '/settings/channels', label: 'Channels' },
  { href: '/settings/pdpa', label: 'PDPA' },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Dev fallback: when Supabase env is missing, render with a synthetic admin
  // context so the new in-app + admin surfaces are walkable for prototyping.
  const ctx = isSupabaseConfigured()
    ? await requireMembership()
    : DEV_CONTEXT;
  const { orgName, role, user } = ctx;
  const isAdmin = role === 'owner' || role === 'admin';

  // Resolve the m15 flag once so the nav can hide entries when off.
  const orgIdForFlag =
    'orgId' in ctx ? ctx.orgId : null;
  const m15On = await isFlagEnabled(
    typeof orgIdForFlag === 'string' ? orgIdForFlag : null,
    FLAG_M15,
  );

  const mainLinks = m15On ? [...baseMainLinks, ...m15MainLinks] : baseMainLinks;
  const settingsLinks = m15On ? m15SettingsLinks : [];

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
              <Link href="/settings/appearance">Settings</Link>
            </Button>
            <UserMenu email={user.email ?? ''} role={role} />
          </div>
        </div>
        <nav className="flex items-center gap-1 px-6 pb-1.5 text-sm">
          {mainLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <>
              <span className="mx-2 h-4 w-px bg-border" />
              {adminLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </>
          )}
          <span className="mx-2 h-4 w-px bg-border" />
          {settingsLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
