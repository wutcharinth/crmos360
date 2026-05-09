import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TemplateForm } from '../template-form';

export const dynamic = 'force-dynamic';

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { orgId, role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') redirect('/dashboard');

  const admin = createAdminClient();
  const { data: t } = await admin
    .from('reply_templates')
    .select('id, shortcut, title, body, language, category')
    .eq('id', id)
    .eq('org_id', orgId)
    .maybeSingle();

  if (!t) notFound();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <Link href="/admin/templates" className="text-sm text-mute hover:text-ink">
        ← All templates
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit template</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateForm
            mode="edit"
            templateId={t.id as string}
            initial={{
              shortcut: (t.shortcut as string | null) ?? '',
              title: t.title as string,
              body: t.body as string,
              language: (t.language as string | null) ?? 'th',
              category: (t.category as string | null) ?? '',
            }}
          />
        </CardContent>
      </Card>
    </main>
  );
}
