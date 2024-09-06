import { z } from 'zod';
import { AddressSchema, type Address } from './common';
import { log } from '$lib/logger';
import { execute, type IERC6551Executable } from './erc6551';
import type { ReadableContract, WritableContract } from '../viem';
import { iSubscriptionHandleAbi } from '../generated/createz';
import { getContract, pad, parseEventLogs, toHex } from 'viem';

export interface SubscriptionHandle extends ReadableContract {}
export interface WritableSubscriptionHandle extends WritableContract {}

const abi = iSubscriptionHandleAbi;

function contract(subHandle: SubscriptionHandle) {
  return getContract({
    abi,
    address: subHandle.address,
    client: subHandle.publicClient
  });
}

function writableContract(subHandle: WritableSubscriptionHandle) {
  return getContract({
    abi,
    address: subHandle.address,
    client: { public: subHandle.publicClient, wallet: subHandle.walletClient }
  });
}

export const MetadataSchema = z.object({
  description: z.string(),
  image: z.string(),
  externalUrl: z.string()
});

export type Metadata = z.infer<typeof MetadataSchema>;

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

export type SubSettings = z.infer<typeof SubSettingsSchema>;

export function tokenIdToAddress(tokenId: bigint): Address {
  const hex = pad(toHex(tokenId), { size: 20 });
  return AddressSchema.parse(hex);
}

export async function getSubscriptionContractAddresses(
  subHandle: SubscriptionHandle,
  owner: Address
): Promise<Array<Address>> {
  const c = contract(subHandle);
  const tokenBalance = await c.read.balanceOf([owner]);

  log.debug('token balance', owner, tokenBalance, subHandle.address);
  // TODO multicall
  const addresses = new Array<Address>();
  for (let i = 0; i < tokenBalance; i++) {
    // TODO add paging, move this on chain
    const tokenId = await c.read.tokenOfOwnerByIndex([owner, BigInt(i)]);
    const addr = tokenIdToAddress(tokenId);
    addresses.push(addr);
  }
  console.log('addresses', addresses);
  return addresses;
}

export type CreateSubscriptionFunc = (
  name: string,
  symbol: string,
  metadata: Metadata,
  subSettings: SubSettings,
  events?: {
    onCreateTxSubmitted?: (hash: string) => void;
  }
) => Promise<string>;

export function createSubscription(subHandle: WritableSubscriptionHandle): CreateSubscriptionFunc {
  return async (name, symbol, metadata, subSettings, events) => {
    const c = writableContract(subHandle);
    const tx = await c.write.mint([name, symbol, metadata, subSettings]);
    if (events?.onCreateTxSubmitted) events.onCreateTxSubmitted(tx);

    const { logs } = await subHandle.publicClient.waitForTransactionReceipt({ hash: tx });

    const [created] = parseEventLogs({ abi, logs, eventName: 'SubscriptionContractCreated' });

    if (!created) {
      throw new Error('Transaction Log not found');
    }
    return created.args.contractAddress;
  };
}

export function erc6551CreateSubscription(
  account: IERC6551Executable,
  subHandle: WritableSubscriptionHandle
): CreateSubscriptionFunc {
  return async (name, symbol, metadata, subSettings, events) => {
    const tx = await execute(account, subHandle.address, iSubscriptionHandleAbi, 'mint', [
      name,
      symbol,
      metadata,
      subSettings
    ]);

    // TODO refactor to use same implementation
    if (events?.onCreateTxSubmitted) events.onCreateTxSubmitted(tx);

    const { logs } = await account.publicClient.waitForTransactionReceipt({ hash: tx });

    const [created] = parseEventLogs({ abi, logs, eventName: 'SubscriptionContractCreated' });

    if (!created) {
      throw new Error('Transaction Log not found');
    }
    return created.args.contractAddress;
  };
}

export async function isManaged(tokenId: bigint, handle: SubscriptionHandle): Promise<boolean> {
  const c = contract(handle);
  const isManaged = await c.read.isManaged([tokenId]);
  return isManaged;
}
