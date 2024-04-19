import { describe, it, expect } from 'vitest';
import {
  FLAG_MINTING_PAUSED,
  FLAG_RENEWAL_PAUSED,
  FLAG_TIPPING_PAUSED,
  createFlags,
  isFlagSet
} from './subscription';

describe('flag tests', () => {
  it('should find a set flag', () => {
    expect(isFlagSet(BigInt(1), FLAG_MINTING_PAUSED)).toBe(true);
    expect(isFlagSet(BigInt(2), FLAG_RENEWAL_PAUSED)).toBe(true);
    expect(isFlagSet(BigInt(3), FLAG_MINTING_PAUSED)).toBe(true);
    expect(isFlagSet(BigInt(3), FLAG_RENEWAL_PAUSED)).toBe(true);
    expect(isFlagSet(BigInt(7), FLAG_TIPPING_PAUSED)).toBe(true);
  });
  it('should find set flags', () => {
    expect(createFlags(FLAG_MINTING_PAUSED)).toBe(BigInt(1));
    expect(createFlags([FLAG_MINTING_PAUSED])).toBe(BigInt(1));

    expect(createFlags([FLAG_TIPPING_PAUSED])).toBe(BigInt(4));
    expect(createFlags([FLAG_TIPPING_PAUSED, FLAG_MINTING_PAUSED])).toBe(BigInt(5));
    expect(createFlags([FLAG_MINTING_PAUSED, FLAG_TIPPING_PAUSED])).toBe(BigInt(5));

    expect(createFlags(FLAG_TIPPING_PAUSED, BigInt(FLAG_RENEWAL_PAUSED))).toBe(BigInt(6));
  });
});
