import { describe, it, expect } from 'vitest';
import { formatKnowledgeContext } from './format-context';

describe('formatKnowledgeContext', () => {
  it('returns empty string for no hits', () => {
    expect(formatKnowledgeContext([])).toBe('');
  });

  it('formats a single hit with KB1 prefix', () => {
    const out = formatKnowledgeContext([
      { id: '1', title: 'Shipping', body: 'Free over 500 THB', similarity: 0.9 },
    ]);
    expect(out).toContain('[KB1]');
    expect(out).toContain('Shipping');
    expect(out).toContain('Free over 500 THB');
  });

  it('numbers multiple hits sequentially', () => {
    const out = formatKnowledgeContext([
      { id: 'a', title: 'A', body: 'aa', similarity: 0.9 },
      { id: 'b', title: 'B', body: 'bb', similarity: 0.8 },
      { id: 'c', title: 'C', body: 'cc', similarity: 0.7 },
    ]);
    expect(out).toContain('[KB1] A');
    expect(out).toContain('[KB2] B');
    expect(out).toContain('[KB3] C');
  });

  it('separates hits by blank line', () => {
    const out = formatKnowledgeContext([
      { id: 'a', title: 'A', body: 'aa', similarity: 0.9 },
      { id: 'b', title: 'B', body: 'bb', similarity: 0.8 },
    ]);
    expect(out.split('\n\n').length).toBeGreaterThanOrEqual(3);
  });
});
