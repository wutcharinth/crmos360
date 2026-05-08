import { z } from 'zod';

export const orgRoleSchema = z.enum(['owner', 'admin', 'agent']);
export const channelSchema = z.enum(['line', 'messenger', 'instagram']);
export const conversationStatusSchema = z.enum(['open', 'pending', 'resolved', 'closed']);
export const messageDirectionSchema = z.enum(['inbound', 'outbound']);

export const createOrgSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9-]+$/, 'lowercase letters, numbers, hyphens'),
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: orgRoleSchema,
});
