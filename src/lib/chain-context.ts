import { getChainByName, type ChainData } from './chain-config';
import {
  IERC6551Registry__factory,
  type IERC6551Account,
  type IERC6551Registry,
  type Profile,
  IERC6551Account__factory,
  Profile__factory,
  type ISubscriptionHandle,
  ISubscriptionHandle__factory
} from '@createz/contracts/types/ethers-contracts';
import type { Signer } from 'ethers';
import { derived, type Readable } from 'svelte/store';
import { ethersSigner } from './web3/ethers';
import { page } from '$app/stores';

export type ChainEnvironment = {
  chainData: ChainData;
  ethersSigner: Signer;
  erc6551Registry: IERC6551Registry;
  defaultErc6551Account: IERC6551Account;
  // TODO execution
  profileContract: Profile;
  subscriptionHandleContract: ISubscriptionHandle;
  // TODO Badge Handle
};

const networkSegment: Readable<string | undefined> = derived(page, (page) => {
  console.log(`Extracting navigation segment from page params`, page);
  const network = page.params?.network;
  console.log(`network segment is`, network);
  return network;
});

export const chainEnvironment: Readable<ChainEnvironment | undefined> = derived(
  [ethersSigner, networkSegment],
  ([ethersSigner, network]) => {
    console.debug(`Constructing ChainContext from ethersSigner and page`, ethersSigner, network);
    if (!network || !ethersSigner) {
      return;
    }
    const chain = getChainByName(network);
    if (!chain) {
      return;
    }

    // debugger;
    const erc6551Registry = IERC6551Registry__factory.connect(
      chain.contracts.erc6551Registry,
      ethersSigner
    );
    const defaultAccount = IERC6551Account__factory.connect(
      chain.contracts.defaultErc6551Implementation,
      ethersSigner
    );
    const profile = Profile__factory.connect(chain.contracts.profile, ethersSigner);
    const subHandle = ISubscriptionHandle__factory.connect(
      chain.contracts.subscriptionHandle,
      ethersSigner
    );

    return {
      chainData: chain,
      ethersSigner: ethersSigner,
      erc6551Registry: erc6551Registry,
      defaultErc6551Account: defaultAccount,
      profileContract: profile,
      subscriptionHandleContract: subHandle
    };
  }
);
