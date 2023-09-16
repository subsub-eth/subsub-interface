import { ZeroAddress } from 'ethers';
import { AddressSchema } from './contracts/common';

const dataJsonPrelude = 'data:application/json;base64,';

function jsonEscape(str: string): string {
  return str.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
}
export function decodeDataJsonTokenURI<T>(encodedJson: string): T {
  if (!encodedJson.startsWith(dataJsonPrelude)) {
    throw new Error(`Encoded JSON string does not include prelude: ${encodedJson}`);
  }
  const payload = atob(encodedJson.substring(dataJsonPrelude.length));

  // escape the payload as string might contain invalid values JSON cannot handle
  const escaped = jsonEscape(payload);
  console.log('payload', escaped);
  return JSON.parse(escaped) as T;
}

export function addressEquals(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) {
    return false;
  }
  return a?.toLowerCase() === b?.toLowerCase();
}

export const zeroAddress = AddressSchema.parse(ZeroAddress);
