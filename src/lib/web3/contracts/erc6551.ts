import type { IERC6551Registry } from '@createz/contracts/types/ethers-contracts';
import { AddressSchema, type Address } from './common';
import type { ChainEnvironment } from '$lib/chain-context';
import { log } from '$lib/logger';

async function findErc6551Account(
  registry: IERC6551Registry,
  implementation: Address,
  salt: Uint8Array,
  chainId: number,
  erc721Address: Address,
  tokenId: bigint
): Promise<Address | undefined> {
  // TODO replace with off-chain computation
  const acc = await registry.account(implementation, salt, chainId, erc721Address, tokenId);

  return AddressSchema.parse(acc);
}

export async function findDefaultProfileErc6551Account(
  chainEnv: ChainEnvironment,
  tokenId: bigint
): Promise<Address | undefined> {
  const { erc6551Registry, chainData } = chainEnv;
  const { contracts, chainId } = chainData;
  const { defaultErc6551Implementation, profile } = contracts;
  const acc = await findErc6551Account(
    erc6551Registry,
    defaultErc6551Implementation,
    new Uint8Array(32),
    chainId,
    profile,
    tokenId
  );

  log.debug('Default ERC6551 Account for tokenId', chainEnv, tokenId, acc);

  return acc
}
