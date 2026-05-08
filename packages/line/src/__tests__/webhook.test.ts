import { describe, it, expect } from 'vitest';
import { createHmac } from 'node:crypto';
import { verifySignature } from '../webhook';

const SECRET = 'test-channel-secret-123';

function sign(body: string, secret = SECRET): string {
  return createHmac('sha256', secret).update(body).digest('base64');
}

describe('verifySignature', () => {
  it('returns true for a valid signature', () => {
    const body = JSON.stringify({ destination: 'U123', events: [] });
    expect(verifySignature(SECRET, body, sign(body))).toBe(true);
  });

  it('rejects an empty signature', () => {
    expect(verifySignature(SECRET, 'hi', '')).toBe(false);
  });

  it('rejects a signature signed with a different secret', () => {
    const body = JSON.stringify({ events: [] });
    expect(verifySignature(SECRET, body, sign(body, 'wrong-secret'))).toBe(false);
  });

  it('rejects a tampered body even if signature is valid for another body', () => {
    const original = JSON.stringify({ events: [{ type: 'message' }] });
    const tampered = JSON.stringify({ events: [{ type: 'admin' }] });
    expect(verifySignature(SECRET, tampered, sign(original))).toBe(false);
  });

  it('handles Buffer body input', () => {
    const body = JSON.stringify({ events: [] });
    expect(verifySignature(SECRET, Buffer.from(body), sign(body))).toBe(true);
  });

  it('returns false on signatures of mismatched length', () => {
    expect(verifySignature(SECRET, 'hi', 'short')).toBe(false);
  });
});
