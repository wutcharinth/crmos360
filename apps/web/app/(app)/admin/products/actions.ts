'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { embed } from '@crmos360/ai';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { recordAction } from '@/lib/audit';

const schema = z.object({
  sku: z.string().max(60).optional().or(z.literal('')),
  name: z.string().min(2).max(160),
  description: z.string().max(2000).optional().or(z.literal('')),
  price: z.string().optional().or(z.literal('')),
  currency: z.string().max(8).optional().or(z.literal('')),
  inStock: z.boolean(),
});

export type ProductState = { ok: boolean; error?: string; id?: string } | null;

async function tryEmbed(text: string): Promise<number[] | null> {
  if (!process.env.GEMINI_API_KEY) return null;
  try {
    return await embed(text);
  } catch {
    return null;
  }
}

function priceToCents(p: string): number | null {
  if (!p) return null;
  const n = Number(p);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

export async function createProductAction(
  _prev: ProductState,
  formData: FormData,
): Promise<ProductState> {
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') {
    return { ok: false, error: 'Only owners or admins can edit products.' };
  }

  const parsed = schema.safeParse({
    sku: formData.get('sku') ?? '',
    name: formData.get('name'),
    description: formData.get('description') ?? '',
    price: formData.get('price') ?? '',
    currency: formData.get('currency') ?? 'THB',
    inStock: formData.get('inStock') === 'on',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') };
  }

  const admin = createAdminClient();
  const embedding = await tryEmbed(`${parsed.data.name}\n${parsed.data.description ?? ''}`);

  const { data, error } = await admin
    .from('products')
    .insert({
      org_id: orgId,
      sku: parsed.data.sku || null,
      name: parsed.data.name,
      description: parsed.data.description || null,
      price_cents: priceToCents(parsed.data.price ?? ''),
      currency: (parsed.data.currency || 'THB').toUpperCase().slice(0, 6),
      in_stock: parsed.data.inStock,
      embedding,
    })
    .select('id')
    .single();

  if (error) return { ok: false, error: error.message };

  await recordAction({
    orgId,
    actorType: 'user',
    actorUserId: user.id,
    action: 'product.create',
    resourceKind: 'product',
    resourceId: data.id,
    metadata: { name: parsed.data.name, sku: parsed.data.sku ?? null },
  });

  revalidatePath('/admin/products');
  redirect(`/admin/products/${data.id}`);
}

export async function updateProductAction(
  productId: string,
  _prev: ProductState,
  formData: FormData,
): Promise<ProductState> {
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') {
    return { ok: false, error: 'Only owners or admins can edit products.' };
  }

  const parsed = schema.safeParse({
    sku: formData.get('sku') ?? '',
    name: formData.get('name'),
    description: formData.get('description') ?? '',
    price: formData.get('price') ?? '',
    currency: formData.get('currency') ?? 'THB',
    inStock: formData.get('inStock') === 'on',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') };
  }

  const admin = createAdminClient();
  const embedding = await tryEmbed(`${parsed.data.name}\n${parsed.data.description ?? ''}`);

  const { error } = await admin
    .from('products')
    .update({
      sku: parsed.data.sku || null,
      name: parsed.data.name,
      description: parsed.data.description || null,
      price_cents: priceToCents(parsed.data.price ?? ''),
      currency: (parsed.data.currency || 'THB').toUpperCase().slice(0, 6),
      in_stock: parsed.data.inStock,
      embedding,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId)
    .eq('org_id', orgId);

  if (error) return { ok: false, error: error.message };

  await recordAction({
    orgId,
    actorType: 'user',
    actorUserId: user.id,
    action: 'product.update',
    resourceKind: 'product',
    resourceId: productId,
    metadata: { name: parsed.data.name },
  });

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${productId}`);
  return { ok: true, id: productId };
}

export async function archiveProductAction(productId: string): Promise<void> {
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') return;

  const admin = createAdminClient();
  await admin
    .from('products')
    .update({ archived: true, updated_at: new Date().toISOString() })
    .eq('id', productId)
    .eq('org_id', orgId);

  await recordAction({
    orgId,
    actorType: 'user',
    actorUserId: user.id,
    action: 'product.archive',
    resourceKind: 'product',
    resourceId: productId,
  });

  revalidatePath('/admin/products');
  redirect('/admin/products');
}
