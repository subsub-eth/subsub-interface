import { dev } from '$app/environment';

import type { Chain } from '@web3-onboard/common';

const allChains = [
  {
    id: 1,
    name: 'ethereum',
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: 'https://eth.llamarpc.com',
    dev: false
  },
  {
    id: 137,
    name: 'polygon',
    token: 'MATIC',
    label: 'Polygon Mainnet',
    rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
    dev: false
  },
  {
    id: 1337,
    name: 'localhost',
    token: 'ETH',
    label: 'localhost',
    rpcUrl: 'http://localhost:8545',
    dev: true
  }
];

export const chains = allChains
  .filter((c) => !c.dev || (dev && c.dev));

export const chainNames = chains.map(c => c.name);

export const onBoardChains: Chain[] = chains
  .map((c) => {
    return {
      id: '' + c.id,
      token: c.token,
      label: c.label,
      rpcUrl: c.rpcUrl
    };
  });

export const getChain = function(id: number) {
  return allChains.find((c) => c.id === id);
};
