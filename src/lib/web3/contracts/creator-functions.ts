import type { Creator } from '@createz/contracts/types/ethers-contracts/Creator';

async function loadLastTokenIds(
  loadAtIndex: (num: bigint) => Promise<bigint>,
  indexEnd: bigint,
  count: number
): Promise<Array<bigint>> {
  if (indexEnd < 0n) {
    return [];
  }

  const range = Array.from(Array(count).keys()).map((i) => indexEnd - BigInt(i));

  // TODO change to a multicall
  const promises = range.map((i) => loadAtIndex(i));

  return Promise.all(promises);
}

async function loadFirstTokenIds(
  loadAtIndex: (num: bigint) => Promise<bigint>,
  indexStart: bigint,
  count: number
): Promise<Array<bigint>> {
  const range = Array.from(Array(count).keys()).map((i) => indexStart + BigInt(i));

  // TODO change to a multicall
  const promises = range.map((i) => loadAtIndex(i));

  return Promise.all(promises);
}

export async function loadLastAllTokenIds(
  contract: Creator,
  indexEnd: bigint,
  count: number
): Promise<Array<bigint>> {
  return loadLastTokenIds(async (i: bigint) => contract.tokenByIndex(i), indexEnd, count);
}

export async function loadFirstOwnerTokenIds(
  contract: Creator,
  owner: string,
  indexStart: bigint,
  count: number
): Promise<Array<bigint>> {
  return loadFirstTokenIds(
    async (i: bigint) => contract.tokenOfOwnerByIndex(owner, i),
    indexStart,
    count
  );
}
