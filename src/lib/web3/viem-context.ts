import { derived, type Readable } from 'svelte/store';
import { currentAccount, primaryWallet } from './onboard';
import { createWalletClient, custom, createPublicClient, http } from 'viem';

import { log } from '$lib/logger';
import { networkSegment } from '$lib/network-segment.svelte';
import { getChainByName } from '$lib/chain-config';
import type { ReadClient, WriteClient } from './viem';

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
