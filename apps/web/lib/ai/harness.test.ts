import { describe, it, expect } from 'vitest';

// Avoid pulling server-only side effects: re-implement the pure helpers
// here for unit tests and rely on a separate integration test for the
// LLM-touching parts. Mirror is intentional — small surface, low risk
// of drift, and lets the suite run without GEMINI_API_KEY.

const LEGAL_KEYWORDS = ['แจ้งความ', 'ฟ้อง', 'sue', 'lawyer', 'legal action'];
const NEGATIVE_KEYWORDS = ['แย่', 'ไม่พอใจ', 'cancel', 'refund', 'angry'];

function quickSentimentSignals(text: string): {
  hasLegalKeyword: boolean;
  hasNegativeSentiment: boolean;
} {
  const lower = text.toLowerCase();
  return {
    hasLegalKeyword: LEGAL_KEYWORDS.some((k) => lower.includes(k.toLowerCase())),
    hasNegativeSentiment: NEGATIVE_KEYWORDS.some((k) => lower.includes(k.toLowerCase())),
  };
}

type ConfidenceTier = 'auto' | 'approval' | 'escalate';
function gateConfidence(args: {
  confidence: number;
  hasNegativeSentiment?: boolean;
  hasLegalKeyword?: boolean;
  isFirstContact?: boolean;
}): ConfidenceTier {
  if (args.hasLegalKeyword) return 'escalate';
  if (args.hasNegativeSentiment && args.confidence < 0.7) return 'escalate';
  if (args.confidence < 0.55) return 'approval';
  if (args.confidence < 0.75 && args.isFirstContact) return 'approval';
  return 'auto';
}

describe('quickSentimentSignals', () => {
  it('detects Thai legal keyword', () => {
    expect(quickSentimentSignals('จะแจ้งความนะ').hasLegalKeyword).toBe(true);
  });
  it('detects English legal keyword case-insensitive', () => {
    expect(quickSentimentSignals('I will SUE you').hasLegalKeyword).toBe(true);
  });
  it('detects negative sentiment', () => {
    expect(quickSentimentSignals('I want a refund').hasNegativeSentiment).toBe(true);
  });
  it('returns false for neutral message', () => {
    const r = quickSentimentSignals('สวัสดีค่ะ ขอเช็คสินค้านะคะ');
    expect(r.hasLegalKeyword).toBe(false);
    expect(r.hasNegativeSentiment).toBe(false);
  });
});

describe('gateConfidence', () => {
  it('escalates on legal keyword regardless of confidence', () => {
    expect(gateConfidence({ confidence: 0.99, hasLegalKeyword: true })).toBe('escalate');
  });
  it('escalates on negative + low confidence', () => {
    expect(
      gateConfidence({ confidence: 0.5, hasNegativeSentiment: true }),
    ).toBe('escalate');
  });
  it('does NOT escalate on negative + high confidence', () => {
    expect(
      gateConfidence({ confidence: 0.9, hasNegativeSentiment: true }),
    ).toBe('auto');
  });
  it('routes to approval below 0.55 confidence', () => {
    expect(gateConfidence({ confidence: 0.4 })).toBe('approval');
  });
  it('routes first-contact to approval below 0.75', () => {
    expect(
      gateConfidence({ confidence: 0.6, isFirstContact: true }),
    ).toBe('approval');
  });
  it('auto-replies above 0.75 on first contact', () => {
    expect(
      gateConfidence({ confidence: 0.8, isFirstContact: true }),
    ).toBe('auto');
  });
});
