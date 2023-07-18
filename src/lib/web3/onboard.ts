import Onboard, { type WalletState } from '@web3-onboard/core';
import type { OnboardAPI } from '@web3-onboard/core';
import injectedWalletsModule from '@web3-onboard/injected-wallets';

import { onBoardChains as chains } from './chains';
import { Observable, distinctUntilChanged, map } from 'rxjs';
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

// is connected
export const isAccountConnected$ = primaryWallet$.pipe(
  map((wallet) => {
    const value = !!wallet?.accounts[0];
    console.debug(`onboard: isAccountConnected`, value);
    return value;
  })
);

const accountConnected = writable<boolean>(false);

export const accountConnected$ = primaryWallet$.pipe(
  map((wallet) => {
    const value = wallet?.accounts[0];
    return value;
  })
);

accountConnected$.subscribe((isConnected) => {
  console.debug(`Setting connected wallet to store`, isConnected);
  accountConnected.set(!!isConnected);
});

export const isAccountConnected = readonly(accountConnected);

// current account
const currentAccountStore = writable<string | null>();

export const currentAccount$ = primaryWallet$.pipe(
  map((wallet) => {
    const account = wallet?.accounts[0]?.address;
    console.debug(`current account from primary wallet`, account);
    return account;
  })
);

currentAccount$.subscribe((acc) => {
  console.debug('setting current account to store', acc);
  currentAccountStore.set(acc);
});

export const currentAccount = readonly(currentAccountStore);

// current chain
const currentChainIdStore = writable<null | number>();

export const currentChainId$ = primaryWallet$.pipe(
  map((wallet) => {
    if (!wallet) {
      return null;
    }
    const [chain] = wallet.chains;
    return Number(chain.id);
  })
);

currentChainId$.subscribe((chainId) => {
  console.debug(`setting chain id`, chainId);
  currentChainIdStore.set(chainId);
});

export const currentChainId = readonly(currentChainIdStore);
