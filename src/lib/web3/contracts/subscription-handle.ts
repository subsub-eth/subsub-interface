import { z } from 'zod';
import { AddressSchema, WritingMetadataSchema, type Address } from './common';
import type { EventDispatcher } from 'svelte';
import type { CreateEvents } from '$lib/components/subscription-manager/action/subscription-manager-events';
import { findLog } from '../ethers';
import type { ISubscriptionHandle } from '@createz/contracts/types/ethers-contracts';
import type { MetadataStructStruct, SubSettingsStruct } from '@createz/contracts/types/ethers-contracts/ISubscriptionHandle.sol/ISubscriptionHandle';
import { toBeHex } from 'ethers';
import { log } from '$lib/logger';

export const SubSettingsSchema = z.object({
  token: AddressSchema,
  rate: z.bigint(),
  lock: z
    .number()
    .gte(0, 'Lock has to be at least 0')
    .lte(10_000, 'Lock has to be less or equal to 10000'),
  epochSize: z.bigint()
});

export const SubscriptionContractPropsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must have at least 3 chars')
    .max(48, 'Name can be 48 chars at most'),
  symbol: z
    .string()
    .trim()
    .min(2, 'Symbol must have at least 2 chars')
    .max(12, 'Symbol can be 12 chars at most'),
  metadata: z.object(WritingMetadataSchema.shape),
  subSettings: z.object(SubSettingsSchema.shape)
});

export type SubscriptionContractProps = z.infer<typeof SubscriptionContractPropsSchema>;

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

export function createSubscription(
  contract: ISubscriptionHandle,
  profileId: bigint
): (
  name: string,
  symbol: string,
  metadata: MetadataStructStruct,
  subSettings: SubSettingsStruct,
  dispatch: EventDispatcher<CreateEvents>
) => Promise<string> {
  return async (
    name: string,
    symbol: string,
    metadata: MetadataStructStruct,
    subSettings: SubSettingsStruct,
    dispatch: EventDispatcher<CreateEvents>
  ): Promise<string> => {
    const tx = await contract.createSubscription(name, symbol, metadata, subSettings, profileId);
    dispatch('createTxSubmitted', tx.hash);
    const createEvent = await findLog(
      tx,
      contract,
      contract.filters.SubscriptionContractCreated(profileId)
    );
    if (!createEvent) {
      throw new Error('Transaction Log not found');
    }
    const address = createEvent?.args.contractAddress;
    dispatch('created', [address, tx.hash]);
    return address;
  };
}
