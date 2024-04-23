import { z } from 'zod';
import {
  AttributesMetadataSchema,
  MetadataSchema,
  AddressSchema,
  fromAttributes,
  BigNumberishSchema,
  type Address,
  type BigNumberish,
  asChecksumAddress,
  type Hash,
  type OnTxSubmitted
} from './common';
import {
  Subscription__factory,
  type Subscription
} from '@createz/contracts/types/ethers-contracts';
import type { EventDispatcher } from 'svelte';
import type { ClaimEvents } from '$lib/components/subscription/action/subscription-events';
import { findLog, getReceipt } from '../ethers';
import { decodeDataJsonTokenURI } from '../helpers';
import { ZeroAddress, type Signer } from 'ethers';
import { log } from '$lib/logger';
import { ContractTransactionResponse } from 'ethers';

export const MULTIPLIER_BASE = 100;

const FundsPropsSchema = z.object({
  amount: z.bigint().min(0n, 'Amount must be larger or equal to 0')
});

type FundsProps = z.infer<typeof FundsPropsSchema>;

export const WithdrawPropsSchema = FundsPropsSchema;

export type WithdrawProps = FundsProps;

export const DepositPropsSchema = FundsPropsSchema.extend({
  message: z.string().optional()
});

export type DepositProps = z.infer<typeof DepositPropsSchema>;

const SubscriptionContractBaseAttributesSchema = z.object({
  token: AddressSchema,
  rate: BigNumberishSchema,
  lock: z.number(),
  epochSize: z.number(),
  maxSupply: BigNumberishSchema,
  totalSupply: BigNumberishSchema,
  activeShares: BigNumberishSchema,
  owner: AddressSchema,
  claimable: BigNumberishSchema,
  depositsClaimed: BigNumberishSchema,
  tipsClaimed: BigNumberishSchema
});

/**
 * Metadata structure returned from the contract
 */
const SubscriptionContractExtendedMetadataSchema = z
  .object({
    flags: BigNumberishSchema
  })
  .and(SubscriptionContractBaseAttributesSchema);

type SubscriptionContractExtendedMetadata = z.infer<
  typeof SubscriptionContractExtendedMetadataSchema
>;

export const SubscriptionContractMetadataSchema = MetadataSchema.and(
  SubscriptionContractExtendedMetadataSchema
);

export type SubscriptionContractMetadata = z.infer<typeof SubscriptionContractMetadataSchema>;

/**
 * Translated Subscription contract data
 */
const SubscriptionContractDataSchema = z
  .object({
    address: AddressSchema,
    name: z.string(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    externalUrl: z.string().url().optional(),
    mintingPaused: z.boolean(),
    renewalPaused: z.boolean(),
    tippingPaused: z.boolean()
  })
  .and(SubscriptionContractBaseAttributesSchema);

/**
 * Translated Subscription contract data
 */
export type SubscriptionContractData = z.infer<typeof SubscriptionContractDataSchema>;

const SubscriptionTokenMetadataAttributesSchema = z.object({
  deposited: BigNumberishSchema,
  spent: BigNumberishSchema,
  unspent: BigNumberishSchema,
  withdrawable: BigNumberishSchema,
  tips: BigNumberishSchema,
  isActive: z.boolean(),
  multiplier: z.number(),
  expiresAt: BigNumberishSchema
});

type SubscriptionTokenMetadataAttributes = z.infer<
  typeof SubscriptionTokenMetadataAttributesSchema
>;

export const SubscriptionTokenMetadataSchema = AttributesMetadataSchema.extend({});
export type SubscriptionTokenMetadata = z.infer<typeof SubscriptionTokenMetadataSchema>;

/**
 * Translated Subscription token data
 */
const SubscriptionDataSchema = z
  .object({
    tokenId: BigNumberishSchema,
    address: AddressSchema,
    name: z.string(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    externalUrl: z.string().url().optional()
  })
  .and(SubscriptionTokenMetadataAttributesSchema);

export type SubscriptionData = z.infer<typeof SubscriptionDataSchema>;

export type SubscriptionFlag = 1 | 2 | 4;
export const FLAG_MINTING_PAUSED: SubscriptionFlag = 1;
export const FLAG_RENEWAL_PAUSED: SubscriptionFlag = 2;
export const FLAG_TIPPING_PAUSED: SubscriptionFlag = 4;

export function isFlagSet(flags: BigNumberish, flag: SubscriptionFlag): boolean {
  const bFlag = BigInt(flag);
  const bFlags = BigInt(flags);
  return (bFlag & bFlags) === bFlag;
}

export function createFlags(
  flags: SubscriptionFlag | Array<SubscriptionFlag>,
  currentFlags = 0n
): bigint {
  const ff = Array.isArray(flags) ? flags : [flags];
  return ff.reduce((a, b) => a | BigInt(b), currentFlags);
}

export function monthlyRate(rate: bigint): bigint {
  return rate * BigInt(60 * 60 * 24 * 30);
}

export function activeSubscriptions(activeShares: bigint, totalSupply: number): number {
  return Math.min(Math.floor(Number(BigInt(activeShares) / BigInt(100))), totalSupply);
}

export type SubscriptionContainer = { address: Address; contract: Subscription };
export function createSubscriptionContract(
  address: Address,
  signer: Signer
): SubscriptionContainer {
  return { address: address, contract: Subscription__factory.connect(address, signer) };
}

export async function getContractData(contract: Subscription): Promise<SubscriptionContractData> {
  const encoded = await contract.contractURI();
  const decoded = decodeDataJsonTokenURI(encoded, AttributesMetadataSchema);

  try {
    const m = AttributesMetadataSchema.parse(decoded);

    const a = fromAttributes<SubscriptionContractExtendedMetadata>(m.attributes ?? []);
    const flags = a.bigint('flags');
    return {
      address: asChecksumAddress(await contract.getAddress()),
      name: m.name,
      description: m.description,
      image: m.image,
      externalUrl: m.external_url,
      rate: a.bigint('rate'),
      lock: a.number('lock'),
      epochSize: a.number('epoch_size'),
      maxSupply: a.bigint('max_supply'),
      totalSupply: a.bigint('total_supply'),
      activeShares: a.bigint('active_shares'),
      token: a.address('token'),
      owner: a.address('owner'),
      claimable: a.bigint('claimable'),
      depositsClaimed: a.bigint('deposits_claimed'),
      tipsClaimed: a.bigint('tips_claimed'),
      mintingPaused: isFlagSet(flags, FLAG_MINTING_PAUSED),
      renewalPaused: isFlagSet(flags, FLAG_RENEWAL_PAUSED),
      tippingPaused: isFlagSet(flags, FLAG_TIPPING_PAUSED)
    };
  } catch (err) {
    log.error('received subscription contract metadata is malformed', decoded, err);
    throw err;
  }
}

export async function getSubscriptionData(
  contract: Subscription,
  tokenId: BigNumberish
): Promise<SubscriptionData> {
  const encoded = await contract.tokenURI(BigInt(tokenId));
  const decoded = decodeDataJsonTokenURI(encoded, SubscriptionTokenMetadataSchema);

  try {
    const m = decoded;

    const a = fromAttributes<SubscriptionTokenMetadataAttributes>(m.attributes ?? []);
    return {
      tokenId: BigInt(tokenId),
      address: asChecksumAddress(await contract.getAddress()),
      name: m.name,
      description: m.description,
      image: m.image,
      externalUrl: m.external_url,
      deposited: a.bigint('deposited'),
      spent: a.bigint('spent'),
      unspent: a.bigint('unspent'),
      withdrawable: a.bigint('withdrawable'),
      tips: a.bigint('tips'),
      isActive: a.boolean('is_active'),
      multiplier: a.number('multiplier'),
      expiresAt: a.bigint('expires_at')
    };
  } catch (err) {
    log.error('received subscription token metadata is malformed', decoded, err);
    throw err;
  }
}

export type WithdrawalFunc = (
  amount: bigint,
  events?: { onWithdrawTxSubmitted?: OnTxSubmitted }
) => Promise<[bigint, Hash]>;

export function withdraw(contract: Subscription, tokenId: bigint): WithdrawalFunc {
  return async (amount, events) => {
    const tx = await contract.withdraw(tokenId, amount);
    events?.onWithdrawTxSubmitted?.(tx.hash);

    const receipt = await getReceipt(tx);
    return [amount, receipt.hash];
  };
}

export type CancelFunc = (events?: {
  onWithdrawTxSubmitted?: OnTxSubmitted;
}) => Promise<[bigint, Hash]>;

export function cancel(contract: Subscription, tokenId: bigint): CancelFunc {
  return async (events) => {
    const tx = await contract.cancel(tokenId);
    events?.onWithdrawTxSubmitted?.(tx.hash);

    const withdrawnEvent = await findLog(
      tx,
      contract,
      contract.filters.SubscriptionWithdrawn(tokenId)
    );
    if (!withdrawnEvent) {
      throw new Error('Transaction Log not found');
    }
    const amount = withdrawnEvent?.args.removedAmount;
    return [amount, tx.hash];
  };
}

export type DepositFunc = (
  amount: bigint,
  message: string,
  events?: {
    onDepositTxSubmitted?: OnTxSubmitted;
  }
) => Promise<[bigint, string, Hash]>;

export function renew(contract: Subscription, tokenId: bigint): DepositFunc {
  return async (amount, message, events) => {
    const tx = await contract.renew(tokenId, amount, message);
    events?.onDepositTxSubmitted?.(tx.hash);
    const receipt = await getReceipt(tx);

    return [amount, message, receipt.hash];
  };
}

export function tip(contract: Subscription, tokenId: bigint): DepositFunc {
  return async (amount, message, events) => {
    const tx = await contract.tip(tokenId, amount, message);
    events?.onDepositTxSubmitted?.(tx.hash);
    const receipt = await getReceipt(tx);

    return [amount, message, receipt.hash];
  };
}

export type MintFunc = (
  amount: bigint,
  multiplier: number,
  message: string,
  events?: {
    onMintTxSubmitted?: (hash: Hash) => void;
  }
) => Promise<[bigint, bigint, string, Hash]>;

export function mint(contract: Subscription, currentAccount: string): MintFunc {
  return async (amount, multiplier, message, events) => {
    const tx = await contract.mint(amount, multiplier, message);
    events?.onMintTxSubmitted?.(tx.hash);
    const mintEvent = await findLog(
      tx,
      contract,
      contract.filters.Transfer(ZeroAddress, currentAccount)
    );
    if (!mintEvent) {
      throw new Error('Transaction Log not found');
    }
    const tokenId = mintEvent?.args.tokenId;

    return [tokenId, amount, message, tx.hash];
  };
}

export type ClaimFunc = (
  address: Address,
  events?: {
    onClaimTxSubmitted?: (hash: Hash) => void;
  }
) => Promise<[bigint, Hash]>;

export function claim(contract: Subscription): ClaimFunc {
  return async (address, events) => {
    // we increase the gas estimate as `claim` iterates over epochs which
    // might require more gas between estimate and actual execution
    const gasEstimate = await contract.claim.estimateGas(address);

    // increase to 110% of original estimate
    const increasedGas = (gasEstimate * 11n) / 10n;
    const tx = await contract.claim(address, { gasLimit: increasedGas });
    events?.onClaimTxSubmitted?.(tx.hash);
    const claimEvent = await findLog(tx, contract, contract.filters.FundsClaimed());
    if (!claimEvent) {
      throw new Error('Transaction Log not found');
    }
    return [claimEvent.args.amount, tx.hash];
  };
}

export type UpdateDescription = (
  description: string,
  events?: { onDescriptionTxSubmitted?: (hash: Hash) => void }
) => Promise<[string, Hash]>;
export type UpdateImage = (
  image: string,
  events?: { onImageTxSubmitted?: (hash: Hash) => void }
) => Promise<[string, Hash]>;
export type UpdateExternalUrl = (
  externalUrl: string,
  events?: { onExternalUrlTxSubmitted?: (hash: Hash) => void }
) => Promise<[string, Hash]>;
export type UpdateFlags = (
  flags: bigint,
  events?: { onFlagsTxSubmitted?: (hash: Hash) => void }
) => Promise<[bigint, Hash]>;

async function setProperty<T>(
  func: (s: T) => Promise<ContractTransactionResponse>,
  value: T,
  onSubmitted?: (hash: Hash) => void
): Promise<[T, Hash]> {
  const tx = await func(value);
  onSubmitted?.(tx.hash);
  await tx.wait();
  return [value, tx.hash];
}

export function setDescription(contract: Subscription): UpdateDescription {
  return async (description, events) => {
    return setProperty(contract.setDescription, description, events?.onDescriptionTxSubmitted);
  };
}

export function setImage(contract: Subscription): UpdateImage {
  return async (image, events) => {
    return setProperty(contract.setImage, image, events?.onImageTxSubmitted);
  };
}

export function setExternalUrl(contract: Subscription): UpdateExternalUrl {
  return async (externalUrl, events) => {
    return setProperty(contract.setExternalUrl, externalUrl, events?.onExternalUrlTxSubmitted);
  };
}

export function setFlags(contract: Subscription): UpdateFlags {
  return async (flags, events) => {
    return setProperty(contract.setFlags, flags, events?.onFlagsTxSubmitted);
  };
}

export async function countUserSubscriptions(
  contract: Subscription,
  account: string
): Promise<number> {
  const count = await contract.balanceOf(account);
  return Number(count);
}

export function listUserSubscriptionsRev(
  contract: Subscription,
  account: string,
  pageSize: number,
  totalItems: number
): (page: number) => Promise<SubscriptionData[]> {
  // TODO multicall
  const func = async (page: number): Promise<SubscriptionData[]> => {
    const index = page * pageSize;
    const count = Math.max(Math.min(totalItems - index, pageSize), 0);

    const load = async (i: number): Promise<SubscriptionData> => {
      // reverse index here
      const id = await contract.tokenOfOwnerByIndex(account, totalItems - 1 - (i + index));
      const res = await getSubscriptionData(contract, id);
      return res;
    };

    const data = [...Array(count).keys()].map((i) => load(i));
    return Promise.all(data);
  };

  return func;
}

export function listSubscriptionContracts(
  ethers: Signer,
  addresses: string[],
  pageSize: number
): (page: number) => Promise<Array<SubscriptionContractData>> {
  // TODO multicall
  const func = async (page: number): Promise<Array<SubscriptionContractData>> => {
    const index = page * pageSize;
    const totalItems = addresses.length;
    const count = Math.max(Math.min(totalItems - index, pageSize), 0);

    const load = async (i: number): Promise<SubscriptionContractData> => {
      const address = addresses[i + index];
      const contract = Subscription__factory.connect(address, ethers);
      try {
        const data = await getContractData(contract);
        return data;
      } catch (err) {
        console.debug(`Failed to load Subscription contract: ${address}`, err);
        throw err;
      }
    };

    const data = [...Array(count).keys()].map((i) => load(i));
    return Promise.all(data);
  };

  return func;
}
