import { getChainByName, type ChainData } from './chain-config';
import { derived, type Readable } from 'svelte/store';
import { page } from '$app/stores';
import { log } from './logger';
import type { Profile } from './web3/contracts/profile';
import { publicClient, type ReadClient } from './web3/viem';
import type { IERC6551Account, IERC6551Registry } from './web3/contracts/erc6551';
import type { SubscriptionHandle } from './web3/contracts/subscription-handle';

export type ReadableChainEnvironment = {
  chainData: ChainData;
  publicClient: ReadClient;
  erc6551Registry: IERC6551Registry;
  defaultErc6551Account: IERC6551Account;
  // TODO execution
  profileContract: Profile;
  subscriptionHandleContract: SubscriptionHandle;
  // TODO Badge Handle
};

const networkSegment: Readable<string | undefined> = derived(page, (page) => {
  log.debug(`Extracting navigation segment from page params`, page);
  const network = page?.params?.network;
  log.debug(`network segment is`, network);
  return network;
});

export const chainEnvironment: Readable<ReadableChainEnvironment | undefined> = derived(
  [publicClient, networkSegment],
  ([publicClient, network]) => {
    console.debug(`Constructing ChainContext from publicClient and page`, publicClient, network);
    if (!network || !publicClient) {
      return;
    }
    const chain = getChainByName(network);
    if (!chain) {
      return;
    }

    const profile = { address: chain.contracts.profile, publicClient: publicClient };
    const erc6551Registry = {
      address: chain.contracts.erc6551Registry,
      publicClient: publicClient
    };
    const defaultErc6551Account = {
      address: chain.contracts.defaultErc6551Implementation,
      publicClient: publicClient
    };
    const subHandle = { address: chain.contracts.subscriptionHandle, publicClient: publicClient };

    return {
      chainData: chain,
      publicClient: publicClient,
      erc6551Registry: erc6551Registry,
      defaultErc6551Account: defaultErc6551Account,
      profileContract: profile,
      subscriptionHandleContract: subHandle
    };
  }
);
