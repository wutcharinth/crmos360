import Link from 'next/link';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerSearch } from './customer-search';

export const dynamic = 'force-dynamic';

interface SearchParams {
  q?: string;
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { orgId } = await requireMembership();
  const params = await searchParams;
  const search = params.q?.trim() ?? '';

  const admin = createAdminClient();
  let query = admin
    .from('customers')
    .select('id, name, channel_ids, tags, created_at')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data: customers } = await query;

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {customers?.length ?? 0} customer{customers?.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CustomerSearch initialQuery={search} />
          <ExportCsvLink />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All customers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!customers || customers.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No customers yet. They&apos;ll appear automatically as messages arrive.
            </div>
          ) : (
            <ul className="divide-y">
              {customers.map((c) => {
                const channelIds = (c.channel_ids ?? {}) as Record<string, string>;
                return (
                  <li key={c.id}>
                    <Link
                      href={`/customers/${c.id}`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-warm-soft text-sm font-medium text-warm">
                        {(c.name?.[0] ?? '?').toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{c.name ?? 'Unnamed'}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {Object.entries(channelIds)
                            .map(([k, v]) => `${k}:${v.slice(0, 10)}…`)
                            .join(' · ') || 'no channel ids'}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        {c.tags?.slice(0, 3).map((t: string) => (
                          <span
                            key={t}
                            className="rounded bg-paper-2 px-1.5 py-0.5 text-xs text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <time className="text-xs text-muted-foreground">
                        {new Date(c.created_at as string).toLocaleDateString()}
                      </time>
                    </Link>
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

function ExportCsvLink() {
  return (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a
      href="/api/customers/export"
      download
      className="rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-accent"
    >
      Export CSV
    </a>
  );
}
