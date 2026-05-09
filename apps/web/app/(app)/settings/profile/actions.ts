'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';

const profileSchema = z.object({
  fullName: z.string().min(1).max(80),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export type ProfileState = { ok: boolean; error?: string } | null;

export async function saveProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const { user } = await requireMembership();

  const parsed = profileSchema.safeParse({
    fullName: formData.get('fullName'),
    avatarUrl: formData.get('avatarUrl') ?? '',
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('user_profiles')
    .update({
      full_name: parsed.data.fullName,
      avatar_url: parsed.data.avatarUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/settings/profile');
  return { ok: true };
}
