import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireMembership } from '@/lib/auth/current-user';
import { extractLessonFromEdit } from '@/lib/ai/lessons';

const ExtractSchema = z.object({
  conversationId: z.string().uuid(),
  aiReplyBody: z.string().min(1).max(10_000),
  humanReplyBody: z.string().min(1).max(10_000),
  aiMessageId: z.string().uuid().optional(),
  humanMessageId: z.string().uuid().optional(),
});

/**
 * Trigger lesson extraction from an AI/human reply pair.
 *
 * Called from the inbox UI when a human sends an edited version of an
 * AI-suggested reply. Wraps `extractLessonFromEdit()` and returns the
 * resulting lesson ID (or null if not generalizable).
 */
export async function POST(req: Request) {
  const { orgId } = await requireMembership();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const parsed = ExtractSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'invalid input' },
      { status: 400 },
    );
  }

  const result = await extractLessonFromEdit({ orgId, ...parsed.data });
  return NextResponse.json({ ok: true, ...result });
}
