import Onboard, { type WalletState } from '@web3-onboard/core';
import type { OnboardAPI } from '@web3-onboard/core';
import injectedWalletsModule from '@web3-onboard/injected-wallets';

import { onBoardChains as chains } from './chains';
import { map } from 'rxjs';
import { readonly, writable } from 'svelte/store';

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

export const wallets$ = onboard.state.select('wallets');

// Wallet
const primaryWalletStore = writable<null | WalletState>();

export const primaryWallet$ = wallets$.pipe(map((wallets) => wallets?.[0]));

primaryWallet$.subscribe((wallet) => {
  console.debug(`Setting primary wallet to store`, wallet);
  primaryWalletStore.set(wallet);
});

export const primaryWallet = readonly(primaryWalletStore);

// is connected
export const isAccountConnected$ = wallets$.pipe(
  map((wallets) => {
    console.debug(`checking connected account`, wallets);
    const value = !!wallets?.[0]?.accounts?.[0];

    console.debug(`onboard: isAccountConnected`, value);
    return value;
  })
);

const accountConnected = writable<boolean>(false);

export const accountConnected$ = wallets$.pipe(
  map((wallets) => {
    const value = !!wallets?.[0]?.accounts?.[0];
    return value;
  })
);

accountConnected$.subscribe((isConnected) => {
  console.debug(`Setting connected wallet to store`);
  accountConnected.set(isConnected);
});

export const isAccountConnected = readonly(accountConnected);
