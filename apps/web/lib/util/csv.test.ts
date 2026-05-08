import { describe, it, expect } from 'vitest';
import { csvEscape, toCsv } from './csv';

describe('csvEscape', () => {
  it('returns empty string for null/undefined', () => {
    expect(csvEscape(null)).toBe('');
    expect(csvEscape(undefined)).toBe('');
  });

  it('passes plain text through', () => {
    expect(csvEscape('hello world')).toBe('hello world');
  });

  it('quotes commas', () => {
    expect(csvEscape('a, b')).toBe('"a, b"');
  });

  it('quotes embedded double quotes and doubles them', () => {
    expect(csvEscape('say "hi"')).toBe('"say ""hi"""');
  });

  it('quotes newlines', () => {
    expect(csvEscape('a\nb')).toBe('"a\nb"');
  });

  it('coerces numbers', () => {
    expect(csvEscape(42)).toBe('42');
  });
});

describe('toCsv', () => {
  it('joins rows with newlines and cells with commas', () => {
    expect(toCsv([['a', 'b'], ['c', 'd']])).toBe('a,b\nc,d');
  });

  it('escapes inside cells', () => {
    expect(toCsv([['x, y', 'z']])).toBe('"x, y",z');
  });
});
