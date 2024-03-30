import { z } from 'zod';
import { AddressSchema, type Address } from './common';
import { findLog } from '../ethers';
import type { IERC6551Executable, ISubscriptionHandle } from '@createz/contracts/types/ethers-contracts';
import type {
  MetadataStructStruct,
  SubSettingsStruct
} from '@createz/contracts/types/ethers-contracts/ISubscriptionHandle.sol/ISubscriptionHandle';
import { toBeHex } from 'ethers';
import { log } from '$lib/logger';
import { execute } from './erc6551';

export const SubSettingsSchema = z.object({
  token: AddressSchema,
  rate: z.bigint(),
  lock: z
    .number()
    .gte(0, 'Lock has to be at least 0')
    .lte(10_000, 'Lock has to be less or equal to 10000'),
  epochSize: z.bigint(),
  maxSupply: z.bigint()
});

export async function getSubscriptionContractAddresses(
  contract: ISubscriptionHandle,
  owner: Address
): Promise<Array<Address>> {
  const tokenBalance = await contract.balanceOf(owner);

  log.debug('token balance', owner, tokenBalance, await contract.getAddress());
  // TODO multicall
  const addresses = new Array<Address>();
  for (let i = 0; i < tokenBalance; i++) {
    // TODO add paging, move this on chain
    const tokenId = await contract.tokenOfOwnerByIndex(owner, i);
    const hex = toBeHex(tokenId, 20);
    addresses.push(AddressSchema.parse(hex));
  }
  return addresses;
}

export type CreateSubscriptionFunc = (
  name: string,
  symbol: string,
  metadata: MetadataStructStruct,
  subSettings: SubSettingsStruct,
  events?: {
    onCreateTxSubmitted?: (hash: string) => void;
  }
) => Promise<string>;

export function createSubscription(
  contract: ISubscriptionHandle,
): CreateSubscriptionFunc {
  return async (name, symbol, metadata, subSettings, events) => {
    const tx = await contract.mint(name, symbol, metadata, subSettings);
    if (events?.onCreateTxSubmitted) events.onCreateTxSubmitted(tx.hash);
    const createEvent = await findLog(
      tx,
      contract,
      contract.filters.SubscriptionContractCreated()
    );
    if (!createEvent) {
      throw new Error('Transaction Log not found');
    }
    const address = createEvent?.args.contractAddress;
    if (events?.onCreated) events.onCreated(address, tx.hash);
    return address;
  };
}

export function erc6551CreateSubscription(
  account: IERC6551Executable,
  contract: ISubscriptionHandle,
): CreateSubscriptionFunc {
  return async (name, symbol, metadata, subSettings, events) => {
    const tx = await execute(account, contract, 'mint', [name, symbol, metadata, subSettings])

    if (events?.onCreateTxSubmitted) events.onCreateTxSubmitted(tx.hash);
    const createEvent = await findLog(
      tx,
      contract,
      contract.filters.SubscriptionContractCreated()
    );
    if (!createEvent) {
      throw new Error('Transaction Log not found');
    }
    const address = createEvent?.args.contractAddress;
    if (events?.onCreated) events.onCreated(address, tx.hash);
    return address;
  };
}
