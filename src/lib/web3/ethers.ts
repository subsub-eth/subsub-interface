import { filter, map } from 'rxjs';
import { ethers } from 'ethers';
import { wallets$ } from './onboard';

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
