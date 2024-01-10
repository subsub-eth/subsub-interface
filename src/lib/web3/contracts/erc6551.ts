import type { IERC6551Registry } from '@createz/contracts/types/ethers-contracts';
import type { Address } from './common';

export async function findErc6551Account(
  registry: IERC6551Registry,
  implementation: Address,
  salt: Uint8Array,
  chainId: number,
  erc721Address: Address,
  tokenId: bigint
): Promise<Address | undefined> {
  // TODO replace with off-chain computation
  const acc = await registry.account(implementation, salt, chainId, erc721Address, tokenId);

  // TODO
  return acc as Address;
}
