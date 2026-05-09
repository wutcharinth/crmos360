import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireMembership } from '@/lib/auth/current-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductForm } from '../product-form';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const { role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') redirect('/dashboard');

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <Link href="/admin/products" className="text-sm text-mute hover:text-ink">
        ← All products
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>New product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            mode="create"
            initial={{
              sku: '',
              name: '',
              description: '',
              price: '',
              currency: 'THB',
              inStock: true,
            }}
          />
        </CardContent>
      </Card>
    </main>
  );
}
