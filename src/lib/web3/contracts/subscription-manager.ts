import { z } from 'zod';
import { MetadataSchema, address } from './common';
import type { ISubscriptionManager } from '@createz/contracts/types/ethers-contracts';
import type {
  MetadataStruct,
  SubSettingsStruct
} from '@createz/contracts/types/ethers-contracts/SubscriptionManager';
import type { EventDispatcher } from 'svelte';
import type { CreateEvents } from '$lib/components/subscription-manager/action/subscription-manager-events';
import { findLog } from '../ethers';

export const SubSettingsSchema = z.object({
  token: address,
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
  metadata: z.object(MetadataSchema.shape),
  subSettings: z.object(SubSettingsSchema.shape)
});

export type SubscriptionContractProps = z.infer<typeof SubscriptionContractPropsSchema>;

export async function getSubscriptionContractAddresses(
  contract: ISubscriptionManager,
  profileId: bigint
): Promise<Array<string>> {
  return contract.getSubscriptionContracts(profileId);
}

export function createSubscription(
  contract: ISubscriptionManager,
  profileId: bigint
): (
  name: string,
  symbol: string,
  metadata: MetadataStruct,
  subSettings: SubSettingsStruct,
  dispatch: EventDispatcher<CreateEvents>
) => Promise<string> {
  return async (
    name: string,
    symbol: string,
    metadata: MetadataStruct,
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
