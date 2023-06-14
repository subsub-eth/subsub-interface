const dataJsonPrelude = 'data:application/json;base64,';

export function decodeDataJsonTokenURI<T>(encodedJson: string): T {
  if (!encodedJson.startsWith(dataJsonPrelude)) {
    throw new Error(`Encoded JSON string does not include prelude: ${encodedJson}`);
  }
  const payload = atob(encodedJson.substring(dataJsonPrelude.length));
  return JSON.parse(payload) as T;
}
