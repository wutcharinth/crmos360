import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TemplateForm } from './template-form';

export const dynamic = 'force-dynamic';

export default async function TemplatesAdminPage() {
  const { orgId } = await requireMembership();

  const admin = createAdminClient();
  const { data: templates } = await admin
    .from('reply_templates')
    .select('id, shortcut, title, body, language, category, use_count, last_used_at, archived')
    .eq('org_id', orgId)
    .eq('archived', false)
    .order('use_count', { ascending: false })
    .limit(200);

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Reply templates</h1>
        <p className="mt-1 text-sm text-ink-2">
          Quick replies your team can drop in via the inbox composer.
          <span className="block mt-0.5">
            Type the shortcut + Tab to expand. AI sees these and may suggest one when the
            customer&rsquo;s question matches.
          </span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">New template</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateForm mode="create" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Existing templates ({templates?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!templates || templates.length === 0 ? (
            <p className="p-4 text-sm text-ink-2">No templates yet.</p>
          ) : (
            <ul className="divide-y divide-hairline">
              {templates.map((t) => (
                <li
                  key={t.id}
                  className="flex items-start justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-medium">
                      {t.shortcut && (
                        <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[11px] text-warm">
                          /{t.shortcut}
                        </code>
                      )}
                      {t.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-2 whitespace-pre-wrap">
                      {t.body}
                    </p>
                    <p className="mt-1 flex items-center gap-3 text-xs text-mute">
                      {t.category && (
                        <span className="rounded bg-paper-2 px-1.5 py-0.5">{t.category}</span>
                      )}
                      <span>{t.language}</span>
                      <span>used {t.use_count}×</span>
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 gap-1">
                    <Link
                      href={`/admin/templates/${t.id}`}
                      className="rounded border border-hairline px-2 py-1 text-[11px] uppercase tracking-wider text-mute hover:bg-paper-2"
                    >
                      edit
                    </Link>
                    <form action={`/api/templates/${t.id}/archive`} method="POST">
                      <button className="rounded border border-hairline px-2 py-1 text-[11px] uppercase tracking-wider text-mute hover:bg-paper-2">
                        archive
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
