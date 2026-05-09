import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArticleForm } from '../article-form';
import { archiveArticleAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { orgId, role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') redirect('/dashboard');

  const admin = createAdminClient();
  const { data: article } = await admin
    .from('knowledge_articles')
    .select('id, title, body, category, archived')
    .eq('id', id)
    .eq('org_id', orgId)
    .maybeSingle();

  if (!article) notFound();

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
          <CardTitle>Edit article</CardTitle>
        </CardHeader>
        <CardContent>
          <ArticleForm
            mode="edit"
            articleId={article.id as string}
            initial={{
              title: article.title as string,
              body: article.body as string,
              category: (article.category ?? '') as string,
            }}
          />
        </CardContent>
      </Card>

      {!article.archived && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Archive</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">
              Archived articles are no longer used by AI but stay in the log.
            </p>
            <form
              action={async () => {
                'use server';
                await archiveArticleAction(article.id as string);
              }}
            >
              <Button type="submit" variant="outline">
                Archive article
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
