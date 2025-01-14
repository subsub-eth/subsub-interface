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
  http
} from 'viem';

import { log } from '$lib/logger';
import type { Address } from './contracts/common';
import { networkSegment } from '$lib/network-segment.svelte';
import { getChainByName } from '$lib/chain-config';

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
  [primaryWallet, networkSegment],
  ([wallet, networkSegment]) => {
    const net = getChainByName(networkSegment);

    if (!net) {
      return undefined;
    }

    const { chain } = net;
    if (!wallet) {
      log.debug('PublicClient: wallet not set, creating default rpc connection');
      return createPublicClient({ chain, transport: http() });
    }
    log.debug('PublicClient: primary wallet store subscribe', wallet);

    const pub = createPublicClient({ transport: custom(wallet!.provider), chain });

    return pub;
  }
);

export const walletClient: Readable<WriteClient | undefined> = derived(
  [primaryWallet, currentAccount, networkSegment],
  ([wallet, currentAccount, networkSegment]) => {
    const net = getChainByName(networkSegment);

    if (!net) {
      return undefined;
    }

    const { chain } = net;
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
      chain,
      account: currentAccount
    });

    return client;
  }
);

export async function switchChain(client: WriteClient, chainId: number) {
  return await client.switchChain({ id: chainId });
}
