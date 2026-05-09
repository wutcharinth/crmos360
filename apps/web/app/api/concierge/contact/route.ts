import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import {
  appendMessage,
  findThreadBySession,
  updateThread,
  upsertThread,
} from '@/lib/concierge/store';

const SESSION_COOKIE = 'flowaios-concierge-session';

const ContactSchema = z.object({
  name: z.string().trim().max(100).optional(),
  contact: z.string().trim().min(2).max(200), // email / LINE / phone
  message: z.string().trim().max(2000).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'invalid input' },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) {
    return NextResponse.json({ error: 'no session' }, { status: 400 });
  }

  // Reuse existing thread or upsert a new one
  const existing = await findThreadBySession(sessionId);
  const thread = existing ?? (await upsertThread({ sessionId }));

  // Stamp contact details + flip to handed_off
  await updateThread(thread.id, {
    name: parsed.data.name ?? thread.name,
    email: parsed.data.contact, // store contact handle in email field for now
    status: 'handed_off',
  });

  // Persist the message body if provided, marked as user-direction
  if (parsed.data.message) {
    await appendMessage({
      threadId: thread.id,
      direction: 'in',
      body: `[contact-form] ${parsed.data.message}`,
    });
  }

  // Auto-acknowledge in the thread so the visitor's concierge UI shows
  // confirmation when they re-open the panel.
  await appendMessage({
    threadId: thread.id,
    direction: 'out',
    body:
      parsed.data.contact.match(/[ก-๙]/) ||
      parsed.data.contact.match(/^@/)
        ? `รับเรื่องเรียบร้อยค่ะ ทีม FlowAIOS จะติดต่อกลับที่ ${parsed.data.contact} ภายใน 24 ชม.`
        : `Got it, the FlowAIOS team will reach out to ${parsed.data.contact} within 24 hours.`,
    aiGenerated: false,
  });

  return NextResponse.json({
    ok: true,
    threadId: thread.id,
    status: 'handed_off',
  });
}
