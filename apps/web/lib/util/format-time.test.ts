import { describe, it, expect } from 'vitest';
import { formatRelative, formatPercent, greetingForHour } from './format-time';

const NOW = new Date('2026-05-09T12:00:00Z').getTime();

describe('formatRelative', () => {
  it('returns "now" for under 1 minute', () => {
    expect(formatRelative('2026-05-09T11:59:30Z', NOW)).toBe('now');
  });

  it('returns minutes for under 1 hour', () => {
    expect(formatRelative('2026-05-09T11:30:00Z', NOW)).toBe('30m');
  });

  it('returns hours for under 1 day', () => {
    expect(formatRelative('2026-05-09T05:00:00Z', NOW)).toBe('7h');
  });

  it('returns days for under 1 week', () => {
    expect(formatRelative('2026-05-06T12:00:00Z', NOW)).toBe('3d');
  });

  it('falls back to a date for 7+ days ago', () => {
    expect(formatRelative('2026-04-01T12:00:00Z', NOW)).not.toMatch(/^\d+[mhd]$/);
  });

  it('returns a date for future timestamps without crashing', () => {
    expect(typeof formatRelative('2027-01-01T00:00:00Z', NOW)).toBe('string');
  });

  it('returns em dash for invalid input', () => {
    expect(formatRelative('not-a-date', NOW)).toBe('—');
  });
});

describe('formatPercent', () => {
  it('formats fractions to default zero decimals', () => {
    expect(formatPercent(0.5)).toBe('50%');
  });

  it('respects decimals param', () => {
    expect(formatPercent(0.1234, 1)).toBe('12.3%');
  });

  it('returns em dash for non-finite', () => {
    expect(formatPercent(Number.NaN)).toBe('—');
    expect(formatPercent(Infinity)).toBe('—');
  });
});

describe('greetingForHour', () => {
  it.each([
    [0, 'Working late'],
    [4, 'Working late'],
    [5, 'Good morning'],
    [11, 'Good morning'],
    [12, 'Good afternoon'],
    [16, 'Good afternoon'],
    [17, 'Good evening'],
    [20, 'Good evening'],
    [21, 'Working late'],
    [23, 'Working late'],
  ])('hour %i => %s', (hour, expected) => {
    expect(greetingForHour(hour)).toBe(expected);
  });
});
