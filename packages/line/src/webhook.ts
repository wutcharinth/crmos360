import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Verify a LINE Messaging API webhook signature.
 * @param channelSecret - Channel secret from LINE Developers console.
 * @param rawBody - Raw request body (string or Buffer, NOT parsed JSON).
 * @param signature - Value of the `x-line-signature` header.
 */
export function verifySignature(
  channelSecret: string,
  rawBody: string | Buffer,
  signature: string,
): boolean {
  if (!signature) return false;
  const expected = createHmac('sha256', channelSecret).update(rawBody).digest('base64');
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
