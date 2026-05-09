import { redirect } from 'next/navigation';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrandVoiceForm } from './brand-form';

export const dynamic = 'force-dynamic';

export default async function BrandSettingsPage() {
  const { orgId, role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') redirect('/dashboard');

  const admin = createAdminClient();
  const { data: voice } = await admin
    .from('brand_voice')
    .select('*')
    .eq('org_id', orgId)
    .maybeSingle();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Brand voice</h1>
        <p className="mt-1 text-sm text-ink-2">
          How FlowAIOS sounds when it talks to your customers. Applied as a system layer
          before every AI reply.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Voice & tone</CardTitle>
          <CardDescription>The persona FlowAIOS speaks as.</CardDescription>
        </CardHeader>
        <CardContent>
          <BrandVoiceForm
            initial={{
              voice: (voice?.voice as string) ?? 'friendly',
              language: (voice?.language as string) ?? 'th',
              formality: (voice?.formality as string) ?? 'polite',
              signature: (voice?.signature as string) ?? '',
              forbiddenPhrases: ((voice?.forbidden_phrases as string[]) ?? []).join(', '),
              requiredPhrases: ((voice?.required_phrases as string[]) ?? []).join(', '),
              emojiPolicy: (voice?.emoji_policy as string) ?? 'none',
              customInstructions: (voice?.custom_instructions as string) ?? '',
            }}
          />
        </CardContent>
      </Card>
    </main>
  );
}
