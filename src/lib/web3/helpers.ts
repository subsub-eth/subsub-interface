import { zeroAddress as zd, formatUnits as viemFormatUnits } from 'viem';
import { AddressSchema, type BigNumberish } from './contracts/common';
import type { ZodType } from 'zod';
import { log } from '$lib/logger';

export { maxUint256, formatEther, parseUnits, isAddress } from 'viem';

const dataJsonPrelude = 'data:application/json;base64,';

function jsonEscape(str: string): string {
  return str.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
}

export function decodeDataJsonTokenURI<
  T extends ZodType<any, any, any> /* eslint-disable-line @typescript-eslint/no-explicit-any */
>(encodedJson: string, schema: T): T['_output'] {
  if (!encodedJson.startsWith(dataJsonPrelude)) {
    throw new Error(`Encoded JSON string does not include prelude: ${encodedJson}`);
  }
  const payload = atob(encodedJson.substring(dataJsonPrelude.length));

  // escape the payload as string might contain invalid values JSON cannot handle
  const escaped = jsonEscape(payload);

  try {
    const json = JSON.parse(escaped);
    return schema.parse(json);
  } catch (error) {
    log.error('Failed to parse decoded JSON payload', escaped, schema, error);
    throw error;
  }
}

export function addressEquals(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) {
    return false;
  }
  return a?.toLowerCase() === b?.toLowerCase();
}

export function formatUnits(value: BigNumberish, decimals: number) {
  return viemFormatUnits(BigInt(value), decimals);
}

export const zeroAddress = AddressSchema.parse(zd);
export const zero32Bytes = new Uint8Array(32);
