const dataJsonPrelude = 'data:application/json;base64,';

export function decodeDataJsonTokenURI<T>(encodedJson: string): T {
  if (!encodedJson.startsWith(dataJsonPrelude)) {
    throw new Error(`Encoded JSON string does not include prelude: ${encodedJson}`);
  }
  const payload = atob(encodedJson.substring(dataJsonPrelude.length));
  console.log('payload', payload);
  return JSON.parse(payload) as T;
}

export function addressEquals(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) {
    return false;
  }
  return a?.toLowerCase() === b?.toLowerCase();
}
