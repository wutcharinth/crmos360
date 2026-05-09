import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

interface NavGroup {
  label: string;
  items: { href: string; label: string; badge?: string }[];
}

const NAV: NavGroup[] = [
  {
    label: 'Operations',
    items: [
      { href: '/admin', label: 'Overview' },
      { href: '/admin/prospects', label: 'Prospects' },
      { href: '/admin/cost', label: 'Cost' },
      { href: '/admin/health', label: 'Health' },
    ],
  },
  {
    label: 'Agents',
    items: [
      { href: '/admin/agents', label: 'Registry' },
      { href: '/admin/approvals', label: 'Approvals' },
      { href: '/admin/jailbreak', label: 'Jailbreak log' },
    ],
  },
  {
    label: 'Org',
    items: [
      { href: '/admin/team', label: 'Team' },
      { href: '/admin/integrations', label: 'Integrations' },
      { href: '/admin/audit', label: 'Audit' },
    ],
  },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireAdmin();

  return (
    <div className="grid min-h-[calc(100vh-72px)] grid-cols-1 lg:grid-cols-[220px_1fr]">
      <aside className="border-r border-hairline bg-paper-2/60 px-5 py-7 lg:sticky lg:top-[72px] lg:self-start lg:max-h-[calc(100vh-72px)] lg:overflow-y-auto">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
            Admin · founder
          </p>
          <p className="mt-2 truncate text-[13px] font-medium text-ink" title={ctx.email}>
            {ctx.email}
          </p>
          {ctx.membership?.orgName && (
            <p className="mt-0.5 text-[12px] text-mute">{ctx.membership.orgName}</p>
          )}
        </div>

        <nav className="mt-9 space-y-7">
          {NAV.map((group) => (
            <div key={group.label}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                {group.label}
              </p>
              <ul className="mt-3 space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between rounded-md px-2 py-1.5 text-[13.5px] text-ink-2 transition-colors hover:bg-paper hover:text-ink"
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="font-mono text-[10px] uppercase tracking-widest text-warm">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-12 border-t border-hairline pt-5">
          <Link
            href="/inbox"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute hover:text-warm"
          >
            ← back to app
          </Link>
        </div>
      </aside>
      <main className="bg-background">{children}</main>
    </div>
  );
}
