import { describe, it, expect } from 'vitest';
import { convertDecimals, prettyNumber } from './helpers';

describe('prettyNumber', () => {
  it('should keep 0 as 0', () => {
    expect(prettyNumber(0)).toBe('0');
  });

  it('should keep 2 decimals for small numbers', () => {
    // below 4 digits, keep 2 decimals
    expect(prettyNumber(5)).toBe('5.00');
    expect(prettyNumber(5.11)).toBe('5.11');
    expect(prettyNumber(5.01)).toBe('5.01');
    expect(prettyNumber(5.019)).toBe('5.02');
    expect(prettyNumber(4.9999999999941)).toBe('5.00');

    expect(prettyNumber(800)).toBe('800.00');
    expect(prettyNumber(800.02)).toBe('800.02');
  });

  it('should keep multiples of 2 for even smaller numbers', () => {
    // keep a multiple of 2 decimals
    expect(prettyNumber(0.00474299941)).toBe('0.0047');
    expect(prettyNumber(0.00475)).toBe('0.0048');

    expect(prettyNumber(0.004)).toBe('0.0040');
    expect(prettyNumber(0.00004)).toBe('0.000040');

    expect(prettyNumber(0.0000475)).toBe('0.000048');
    expect(prettyNumber(0.000000475)).toBe('0.00000048');
  });

  it('should drop decimals for large numbers', () => {
    // break at 4 digits
    expect(prettyNumber(1000)).toBe('1000');
    expect(prettyNumber(10000)).toBe('10000');
    expect(prettyNumber(10000.02)).toBe('10000');

    expect(prettyNumber(1000001)).toBe('1000001');
  });
});

describe('convertDecimals', () => {
  it('should not convert if current and target match', () => {
    const value = BigInt(100000000);

    expect(convertDecimals(value, 2, 2)).toBe(value);
    expect(convertDecimals(value, 5, 5)).toBe(value);
    expect(convertDecimals(value, 10, 10)).toBe(value);
  });

  it('should convert to more precise representation', () => {
    expect(convertDecimals(100n, 2, 4)).toBe(10000n);
    expect(convertDecimals(100_000n, 5, 6)).toBe(1_000_000n);
    expect(convertDecimals(1n, 10, 18)).toBe(100_000_000n);
  });

  it('should convert to less precise representation', () => {
    expect(convertDecimals(100n, 4, 2)).toBe(1n);
    expect(convertDecimals(100_000n, 5, 4)).toBe(10_000n);
    expect(convertDecimals(1n, 18, 10)).toBe(0n);
  });
});
