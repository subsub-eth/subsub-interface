import { getChainByName, type ChainData } from './chain-config';
import { derived, type Readable } from 'svelte/store';
import { page } from '$app/stores';
import { log } from './logger';
import type { Profile, WritableProfile } from './web3/contracts/profile';
import { publicClient, walletClient, type ReadClient, type WriteClient } from './web3/viem';
import type {
  IERC6551Account,
  IERC6551Executable,
  IERC6551Registry,
  WritableIERC6551Registry
} from './web3/contracts/erc6551';
import type {
  SubscriptionHandle,
  WritableSubscriptionHandle
} from './web3/contracts/subscription-handle';

export type ReadableChainEnvironment = {
  chainData: ChainData;
  publicClient: ReadClient;
  erc6551Registry: IERC6551Registry;
  defaultErc6551Account: IERC6551Account;
  profileContract: Profile;
  subscriptionHandleContract: SubscriptionHandle;
  // TODO Badge Handle
};

export type WritableChainEnvironment = {
  chainData: ChainData;
  publicClient: ReadClient;
  walletClient: WriteClient;
  erc6551Registry: WritableIERC6551Registry;
  defaultErc6551Account: IERC6551Account;
  defaultErc6551Executable: IERC6551Executable;
  profileContract: WritableProfile;
  subscriptionHandleContract: WritableSubscriptionHandle;
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

export const writableChainEnvironment: Readable<WritableChainEnvironment | undefined> = derived(
  [publicClient, walletClient, networkSegment],
  ([publicClient, walletClient, network]) => {
    console.debug(`Constructing WritableChainContext from publicClient, walletClient, and page`, publicClient, walletClient, network);
    if (!network || !publicClient || !walletClient) {
      return;
    }
    const chain = getChainByName(network);
    if (!chain) {
      return;
    }

    const profile = { address: chain.contracts.profile, publicClient, walletClient };
    const erc6551Registry = {
      address: chain.contracts.erc6551Registry,
      publicClient,
      walletClient
    };
    const defaultErc6551Account = {
      address: chain.contracts.defaultErc6551Implementation,
      publicClient
    };

    const defaultErc6551Executable = {
      address: chain.contracts.defaultErc6551Implementation,
      publicClient,
      walletClient
    };
    const subHandle = {
      address: chain.contracts.subscriptionHandle,
      publicClient,
      walletClient
    };

    return {
      chainData: chain,
      publicClient: publicClient,
      walletClient: walletClient,
      erc6551Registry: erc6551Registry,
      defaultErc6551Account,
      defaultErc6551Executable,
      profileContract: profile,
      subscriptionHandleContract: subHandle
    };
  }
);
