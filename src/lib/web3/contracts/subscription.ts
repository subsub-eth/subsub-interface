import { z } from 'zod';
import {
  AttributesMetadataSchema,
  MetadataSchema,
  type AttributesMetadata,
  AddressSchema,
  fromAttributes,
  BigNumberishSchema
} from './common';
import {
  Subscription__factory,
  type Subscription
} from '@createz/contracts/types/ethers-contracts';
import type { EventDispatcher } from 'svelte';
import type {
    ClaimEvents,
  DepositEvents,
  DescriptionChangeEvents,
  ExternalUrlChangeEvents,
  ImageChangeEvents,
  MintEvents,
  WithdrawalEvents
} from '$lib/components/subscription/action/subscription-events';
import { findLog, getReceipt } from '../ethers';
import { decodeDataJsonTokenURI } from '../helpers';
import { ZeroAddress, type Signer } from 'ethers';
import type { PauseEvents, UnpauseEvents } from '$lib/components/common-events';

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

export const MintPropsSchema = DepositPropsSchema.extend({
  multiplier: z
    .number()
    .min(100, 'Multiplier must be larger or equal to 100')
    .max(100_000, 'Multiplier must be less or equal to 100,000')
});

export type MintProps = z.infer<typeof MintPropsSchema>;

export const SubscriptionTokenMetadataSchema = AttributesMetadataSchema.extend({});

export type SubscriptionTokenMetadata = z.infer<typeof SubscriptionTokenMetadataSchema>;

const SubscriptionContractExtendedMetadataSchema = z.object({
  token: AddressSchema,
  rate: z.number(),
  lock: z.number(),
  epochSize: z.number(),
  ownerContract: AddressSchema,
  ownerId: BigNumberishSchema,
  ownerAddress: AddressSchema,
  claimable: BigNumberishSchema,
  totalClaimed: BigNumberishSchema,
  paused: z.boolean(),
});

type SubscriptionContractExtendedMetadata = z.infer<
  typeof SubscriptionContractExtendedMetadataSchema
>;

export const SubscriptionContractMetadataSchema = MetadataSchema.and(
  SubscriptionContractExtendedMetadataSchema
);

export type SubscriptionContractMetadata = z.infer<typeof SubscriptionContractMetadataSchema>;

export async function contractMetadata(
  contract: Subscription
): Promise<SubscriptionContractMetadata> {
  const encoded = await contract.contractURI();
  const decoded = decodeDataJsonTokenURI<AttributesMetadata>(encoded);

  try {
    const m = AttributesMetadataSchema.parse(decoded);

    const a = fromAttributes<SubscriptionContractExtendedMetadata>(m.attributes ?? []);
    return {
      name: m.name,
      description: m.description,
      image: m.image,
      external_url: m.external_url,
      rate: a.number('rate'),
      lock: a.number('lock'),
      epochSize: a.number('epoch_size'),
      token: a.address('token'),
      ownerId: a.bigint('owner_id'),
      ownerAddress: a.address('owner_address'),
      ownerContract: a.address('owner_contract'),
      claimable: a.bigint('claimable'),
      totalClaimed: a.bigint('total_claimed'),
      paused: a.boolean('paused'),
    };
  } catch (err) {
    console.error('received subscription contract metadata is malformed', decoded, err);
    throw err;
  }
}

export function withdraw(
  contract: Subscription,
  tokenId: bigint
): (amount: bigint, dispatch: EventDispatcher<WithdrawalEvents>) => Promise<bigint> {
  return async (amount: bigint, dispatch: EventDispatcher<WithdrawalEvents>) => {
    const tx = await contract.withdraw(tokenId, amount);
    dispatch('withdrawTxSubmitted', tx.hash);

    const receipt = await getReceipt(tx);
    dispatch('withdrawn', [amount, receipt.hash]);
    return amount;
  };
}

export function cancel(
  contract: Subscription,
  tokenId: bigint
): (dispatch: EventDispatcher<WithdrawalEvents>) => Promise<bigint> {
  return async (dispatch: EventDispatcher<WithdrawalEvents>) => {
    const tx = await contract.cancel(tokenId);
    dispatch('withdrawTxSubmitted', tx.hash);

    const withdrawnEvent = await findLog(
      tx,
      contract,
      contract.filters.SubscriptionWithdrawn(tokenId)
    );
    if (!withdrawnEvent) {
      throw new Error('Transaction Log not found');
    }
    const amount = withdrawnEvent?.args.removedAmount;
    dispatch('withdrawn', [amount, tx.hash]);
    return amount;
  };
}

export function renew(
  contract: Subscription,
  tokenId: bigint
): (
  amount: bigint,
  message: string,
  dispatch: EventDispatcher<DepositEvents>
) => Promise<[bigint, string]> {
  return async (
    amount: bigint,
    message: string,
    dispatch: EventDispatcher<DepositEvents>
  ): Promise<[bigint, string]> => {
    const tx = await contract.renew(tokenId, amount, message);
    dispatch('depositTxSubmitted', tx.hash);
    const receipt = await getReceipt(tx);
    dispatch('deposited', [amount, receipt.hash]);

    return [amount, message];
  };
}

export function tip(
  contract: Subscription,
  tokenId: bigint
): (
  amount: bigint,
  message: string,
  dispatch: EventDispatcher<DepositEvents>
) => Promise<[bigint, string]> {
  return async (
    amount: bigint,
    message: string,
    dispatch: EventDispatcher<DepositEvents>
  ): Promise<[bigint, string]> => {
    const tx = await contract.tip(tokenId, amount, message);
    dispatch('depositTxSubmitted', tx.hash);
    const receipt = await getReceipt(tx);
    dispatch('deposited', [amount, receipt.hash]);

    return [amount, message];
  };
}

export function mint(
  contract: Subscription,
  currentAccount: string
): (
  amount: bigint,
  multiplier: number,
  message: string,
  dispatch: EventDispatcher<MintEvents>
) => Promise<[bigint, bigint, string]> {
  return async (
    amount: bigint,
    multiplier: number,
    message: string,
    dispatch: EventDispatcher<MintEvents>
  ): Promise<[bigint, bigint, string]> => {
    const tx = await contract.mint(amount, multiplier, message);
    dispatch('mintTxSubmitted', tx.hash);
    const mintEvent = await findLog(
      tx,
      contract,
      contract.filters.Transfer(ZeroAddress, currentAccount)
    );
    if (!mintEvent) {
      throw new Error('Transaction Log not found');
    }
    const tokenId = mintEvent?.args.tokenId;
    dispatch('minted', [tokenId, tx.hash]);

    return [tokenId, amount, message];
  };
}

export function unpause(
  contract: Subscription
): (
  dispatch: EventDispatcher<UnpauseEvents>
) => Promise<void> {
  return async (
    dispatch: EventDispatcher<UnpauseEvents>
  ): Promise<void> => {
    const tx = await contract.unpause();
    dispatch('unpauseTxSubmitted', tx.hash);
    const unpauseEvent = await findLog(
      tx,
      contract,
      contract.filters.Unpaused()
    );
    if (!unpauseEvent) {
      throw new Error('Transaction Log not found');
    }
    dispatch('unpaused', tx.hash);
  };
}

export function pause(
  contract: Subscription
): (
  dispatch: EventDispatcher<PauseEvents>
) => Promise<void> {
  return async (
    dispatch: EventDispatcher<PauseEvents>
  ): Promise<void> => {
    const tx = await contract.pause();
    dispatch('pauseTxSubmitted', tx.hash);
    const pauseEvent = await findLog(
      tx,
      contract,
      contract.filters.Paused()
    );
    if (!pauseEvent) {
      throw new Error('Transaction Log not found');
    }
    dispatch('paused', tx.hash);
  };
}

export function claim(
  contract: Subscription
): (
  dispatch: EventDispatcher<ClaimEvents>
) => Promise<void> {
  return async (
    dispatch: EventDispatcher<ClaimEvents>
  ): Promise<void> => {
    // we increase the gas estimate as `claim` iterates over epochs which
    // might require more gas between estimate and actual execution
    const gasEstimate = await contract.claim.estimateGas();

    // increase to 110% of original estimate
    const increasedGas = (gasEstimate * 11n) / 10n;
    const tx = await contract.claim({gasLimit: increasedGas});
    dispatch('claimTxSubmitted', tx.hash);
    const claimEvent = await findLog(
      tx,
      contract,
      contract.filters.FundsClaimed()
    );
    if (!claimEvent) {
      throw new Error('Transaction Log not found');
    }
    dispatch('claimed', [claimEvent.args.amount, tx.hash]);
  };
}

export function setDescription(
  contract: Subscription
): (
  description: string,
  dispatch: EventDispatcher<DescriptionChangeEvents>
) => Promise<string> {
  return async (
    description: string,
    dispatch: EventDispatcher<DescriptionChangeEvents>
  ): Promise<string> => {
    const tx = await contract.setDescription(description);
    dispatch('descriptionTxSubmitted', tx.hash);
    await tx.wait();
    dispatch('descriptionChanged', [description, tx.hash]);
    return description;
  };
}

export function setImage(
  contract: Subscription
): (
  image: string,
  dispatch: EventDispatcher<ImageChangeEvents>
) => Promise<string> {
  return async (
    image: string,
    dispatch: EventDispatcher<ImageChangeEvents>
  ): Promise<string> => {
    const tx = await contract.setImage(image);
    dispatch('imageTxSubmitted', tx.hash);
    await tx.wait();
    dispatch('imageChanged', [image, tx.hash]);
    return image;
  };
}

export function setExternalUrl(
  contract: Subscription
): (
  externalUrl: string,
  dispatch: EventDispatcher<ExternalUrlChangeEvents>
) => Promise<string> {
  return async (
    externalUrl: string,
    dispatch: EventDispatcher<ExternalUrlChangeEvents>
  ): Promise<string> => {
    const tx = await contract.setExternalUrl(externalUrl);
    dispatch('externalUrlTxSubmitted', tx.hash);
    await tx.wait();
    dispatch('externalUrlChanged', [externalUrl, tx.hash]);
    return externalUrl;
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
): (page: number) => Promise<[string, bigint, SubscriptionTokenMetadata][]> {
  // TODO multicall
  const func = async (page: number): Promise<[string, bigint, SubscriptionTokenMetadata][]> => {
    const index = page * pageSize;
    const count = Math.max(Math.min(totalItems - index, pageSize), 0);

    const contractAddress = await contract.getAddress();

    const load = async (i: number): Promise<[string, bigint, SubscriptionTokenMetadata]> => {
      // reverse index here
      const id = await contract.tokenOfOwnerByIndex(account, totalItems - 1 - (i + index));
      const encoded = await contract.tokenURI(id);
      const data = decodeDataJsonTokenURI<SubscriptionTokenMetadata>(encoded);
      return [contractAddress, id, data];
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
): (page: number) => Promise<[string, SubscriptionContractMetadata | undefined][]> {
  // TODO multicall
  const func = async (page: number): Promise<[string, SubscriptionContractMetadata | undefined][]> => {
    const index = page * pageSize;
    const totalItems = addresses.length;
    const count = Math.max(Math.min(totalItems - index, pageSize), 0);

    const load = async (i: number): Promise<[string, SubscriptionContractMetadata | undefined]> => {
      const address = addresses[i + index];
      const contract = Subscription__factory.connect(address, ethers);
      try {
        const data = await contractMetadata(contract);
        return [address, data];
      } catch (err) {
        console.debug(`Failed to load Subscription contract: ${address}`, err);
        return [address, undefined];
      }
    };

    const data = [...Array(count).keys()].map((i) => load(i));
    return Promise.all(data);
  };

  return func;
}
