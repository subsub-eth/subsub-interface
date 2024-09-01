import { derived, type Readable } from 'svelte/store';
import { currentAccount, primaryWallet } from './onboard';
import {
  createWalletClient,
  custom,
  createPublicClient,
  type PublicClient,
  type WalletClient,
  type Chain,
  type Transport,
  type Account,
  getContract
} from 'viem';

import { anvil } from 'viem/chains';
import { log } from '$lib/logger';
import type { Address } from './contracts/common';

export type ReadClient = PublicClient<Transport, Chain>;
export type WriteClient = WalletClient<Transport, Chain, Account>;

export interface ReadableContract {
  address: Address;
  publicClient: ReadClient;
}

export interface WritableContract extends ReadableContract {
  walletClient: WriteClient;
}

export const publicClient: Readable<ReadClient | undefined> = derived(
  primaryWallet,
  (wallet) => {
    if (!wallet) {
      log.debug('PublicClient: wallet not set!');
      return undefined;
    }
    log.debug('PublicClient: primary wallet store subscribe', wallet);
    // TODO fix chain
    const pub = createPublicClient({ transport: custom(wallet!.provider), chain: anvil });

    return pub;
  }
);

export const walletClient: Readable<WriteClient | undefined> = derived(
  [primaryWallet, currentAccount],
  ([wallet, currentAccount]) => {
    if (!wallet) {
      log.debug('WalletClient: wallet not set!');
      return undefined;
    }
    if (!currentAccount) {
      log.debug('WalletClient: current account not set!');
      return undefined;
    }
    log.debug('WalletClient: primary wallet store subscribe', wallet);
    const client = createWalletClient({
      transport: custom(wallet.provider),
      chain: anvil,
      account: currentAccount
    });

    getContract
    return client;
  }
);

// export const getSubscriptionContract = async (client: PublicClient, wallet: MyWalletClient) => {
//   const contract = getContract({
//     abi: subscriptionAbi,
//     address: '0x0',
//     client: { public: client, wallet: wallet }
//   });
//
//   // const balance = await contract.read.balanceOf(["0x0"]);
//   // const settings = await contract.write.mint([10n, 10, ""], {chain: undefined, account: "0x0"});
//
//   contract.read.balanceOf([zeroAddress]);
//   contract.write.mint([10n, 10, ""]);
//
//   return contract;
// };
//
// export const getErc20Contract = (client: MyWalletClient, address: Address) => {
//   const contract = getContract({
//     abi: erc20Abi,
//     address: address,
//     client: {wallet: client}
//   });
//
//   contract.write.transfer([target, 10n]);
//
//   return contract;
// };
