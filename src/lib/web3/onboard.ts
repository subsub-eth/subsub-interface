import Onboard, { type WalletState } from '@web3-onboard/core';
import type { OnboardAPI } from '@web3-onboard/core';
import injectedWalletsModule from '@web3-onboard/injected-wallets';

import { onBoardChains as chains } from './chains';
import { Observable, distinctUntilChanged, map } from 'rxjs';
import { derived, readonly, writable, type Readable } from 'svelte/store';
import { asChecksumAddress, type Address } from './contracts/common';

const injected = injectedWalletsModule();

const wallets = [injected];

const appMetadata = {
  name: 'CreateZ',
  icon: '<svg />',
  logo: '<svg />',
  description: 'Connecting to CreateZ',
  recommendedInjectedWallets: [
    { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
    { name: 'MetaMask', url: 'https://metamask.io' }
  ]
};

let onboard;
if (!onboard) {
  onboard = Onboard({
    theme: 'dark',
    accountCenter: {
      desktop: {
        enabled: false
      },
      mobile: {
        enabled: false
      }
    },
    wallets,
    chains,
    appMetadata,
    connect: {
      autoConnectLastWallet: true,
      disableUDResolution: true
    }
  });
}

export default onboard as OnboardAPI;

const wallets$ = onboard.state.select('wallets');

// for some reason the primary wallet needs to be set like this by
// directly subscribing to the rxjs object

const primaryWalletStore = writable<null | WalletState>();

export const primaryWallet$: Observable<WalletState | null> = wallets$.pipe(
  map((wallets) => wallets?.[0] ?? null),
  distinctUntilChanged((previous, current) => {
    if (previous === null || current === null) {
      return false;
    }
    return (
      previous.accounts[0]?.address === current.accounts[0]?.address &&
      previous.label === current.label &&
      previous.chains[0]?.id === current.chains[0]?.id &&
      previous.chains[0]?.namespace === current.chains[0]?.namespace
    );
  })
);

primaryWallet$.subscribe((wallet) => {
  console.debug(`Setting primary wallet to store`, wallet);
  primaryWalletStore.set(wallet);
});

export const primaryWallet = readonly(primaryWalletStore);

export const isAccountConnected: Readable<boolean> = derived(
  primaryWallet,
  (wallet) => {
    const value = !!wallet?.accounts[0];
    console.debug(`onboard: isAccountConnected`, value);
    return value;
  },
  false
);

export const currentAccount: Readable<Address | undefined> = derived(primaryWallet, (wallet) => {
  const account = wallet?.accounts[0]?.address;
  console.debug(`current account from primary wallet`, account);
  return account ? asChecksumAddress(account) : undefined;
});

export const currentChainId: Readable<number | undefined> = derived(primaryWallet, (wallet) => {
  if (!wallet) {
    return undefined;
  }
  const [chain] = wallet.chains;
  return Number(chain.id);
});
