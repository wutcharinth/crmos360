import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function ProductsAdminPage() {
  const { orgId, role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') redirect('/dashboard');

  const admin = createAdminClient();
  const { data: products } = await admin
    .from('products')
    .select('id, sku, name, price_cents, currency, in_stock, archived, updated_at')
    .eq('org_id', orgId)
    .eq('archived', false)
    .order('updated_at', { ascending: false })
    .limit(200);

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Product catalog</h1>
          <p className="mt-1 text-sm text-ink-2">
            Products FlowAIOS can reference when answering customer questions.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">+ New product</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All products</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!products || products.length === 0 ? (
            <div className="p-8 text-center text-sm text-ink-2">
              No products yet. Adding products lets the AI reference them in replies.
            </div>
          ) : (
            <ul className="divide-y divide-hairline">
              {products.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-paper-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="mt-0.5 flex items-center gap-3 text-xs text-mute">
                        {p.sku && <span className="font-mono">{p.sku}</span>}
                        {!p.in_stock && (
                          <span className="rounded bg-rose/10 px-1.5 py-0.5 text-rose">
                            out of stock
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="font-mono text-sm tabular-nums">
                      {p.price_cents != null
                        ? `${(p.price_cents / 100).toLocaleString()} ${p.currency ?? 'THB'}`
                        : '—'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
