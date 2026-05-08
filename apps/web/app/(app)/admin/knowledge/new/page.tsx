import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireMembership } from '@/lib/auth/current-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArticleForm } from '../article-form';

export const dynamic = 'force-dynamic';

export default async function NewArticlePage() {
  const { role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') redirect('/dashboard');

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <Link
        href="/admin/knowledge"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← All articles
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>New article</CardTitle>
        </CardHeader>
        <CardContent>
          <ArticleForm mode="create" />
        </CardContent>
      </Card>
    </main>
  );
}
