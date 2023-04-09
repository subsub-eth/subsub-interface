import { filter, map } from 'rxjs';
import { ethers, type Provider } from 'ethers';
import { wallets$ } from './onboard';
import { readonly, writable } from 'svelte/store';

export const ethersProvider$ = wallets$.pipe(
  map((wallets) => {
    const [primaryWallet] = wallets;
    return primaryWallet;
  }),
  filter((wallet) => !!wallet),
  map((wallet) => {
    return new ethers.BrowserProvider(wallet.provider);
  })
);

const ethersProviderStore = writable<null | Provider>(null);

ethersProvider$.subscribe(provider => {
  console.debug(`Setting ethers provider`, provider);
  ethersProviderStore.set(provider);
});

export const ethersProvider = readonly(ethersProviderStore);
