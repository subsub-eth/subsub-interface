import { z } from 'zod';
import { AddressSchema, type Address } from './common';
import { findLog } from '../ethers';
import { toBeHex } from 'ethers';
import { log } from '$lib/logger';
import { execute } from './erc6551';
import type { ReadableContract, WritableContract } from '../viem';
import { iSubscriptionHandleAbi } from '../generated/createz';
import { getContract } from 'viem';



export interface SubscriptionHandle extends ReadableContract {};
export interface WritableSubscriptionHandle extends WritableContract {};

function contract(subHandle: SubscriptionHandle) {
  return getContract({
    abi: iSubscriptionHandleAbi,
    address: subHandle.address,
    client: subHandle.publicClient
  });
}

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
  subHandle: SubscriptionHandle,
  owner: Address
): Promise<Array<Address>> {
  const c = contract(subHandle)
  const tokenBalance = await c.read.balanceOf([owner]);

  log.debug('token balance', owner, tokenBalance, subHandle.address);
  // TODO multicall
  const addresses = new Array<Address>();
  for (let i = 0; i < tokenBalance; i++) {
    // TODO add paging, move this on chain
    const tokenId = await c.read.tokenOfOwnerByIndex([owner, BigInt(i)]);
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
