import Onboard from '@web3-onboard/core';
import type { OnboardAPI } from '@web3-onboard/core';
import injectedWalletsModule from '@web3-onboard/injected-wallets';

import { chains } from './chains';
import { filter, map } from 'rxjs';

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

export const primaryWallet$ = wallets$.pipe(
  // TODO
  map(wallets => wallets?.[0])
);

export const isAccountConnected$ = wallets$.pipe(
  map(wallets => {
    console.debug(`checking connected account`, wallets);
    return !!wallets?.[0]?.accounts?.[0];
  })
);
