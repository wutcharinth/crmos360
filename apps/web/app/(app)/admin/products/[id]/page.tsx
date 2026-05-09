import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductForm } from '../product-form';
import { archiveProductAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { orgId, role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') redirect('/dashboard');

  const admin = createAdminClient();
  const { data: p } = await admin
    .from('products')
    .select('id, sku, name, description, price_cents, currency, in_stock, archived')
    .eq('id', id)
    .eq('org_id', orgId)
    .maybeSingle();

  if (!p) notFound();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <Link href="/admin/products" className="text-sm text-mute hover:text-ink">
        ← All products
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            mode="edit"
            productId={p.id as string}
            initial={{
              sku: (p.sku as string | null) ?? '',
              name: p.name as string,
              description: (p.description as string | null) ?? '',
              price: p.price_cents != null ? String((p.price_cents as number) / 100) : '',
              currency: (p.currency as string | null) ?? 'THB',
              inStock: Boolean(p.in_stock),
            }}
          />
        </CardContent>
      </Card>

      {!p.archived && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Archive</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-ink-2">
              Archived products are hidden from the catalog and the AI no longer cites them.
            </p>
            <form
              action={async () => {
                'use server';
                await archiveProductAction(p.id as string);
              }}
            >
              <Button type="submit" variant="outline">
                Archive product
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
