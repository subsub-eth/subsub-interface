import { dev } from '$app/environment';

export const profileContractAddr = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';
export const subscriptionManagerContractAddr = '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6';
export const testTokenContractAddr = '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318';

export interface Chains {
  localhost: ChainData;
  polygon: ChainData;
  'polygon-test': ChainData;
}

export interface ChainData {
  isDev: boolean;
  isTest: boolean;
  displayName: string;
  chainId: number;
  token: string;
  rpcUrl: string;
}

export type chain = keyof Chains;

export const chains: Chains = {
  localhost: {
    isDev: true,
    isTest: false,
    displayName: 'Localhost',
    chainId: 31337,
    token: 'ETH',
    rpcUrl: 'http://localhost:8545'
  },
  polygon: {
    isTest: false,
    isDev: false,
    displayName: 'Polygon PoS Mainnet',
    chainId: 137,
    token: 'MATIC',
    rpcUrl: 'https://matic-mainnet.chainstacklabs.com'
  },
  'polygon-test': {
    isDev: false,
    isTest: true,
    displayName: 'Polygon Mumbai Testnet',
    chainId: 80001,
    token: 'MATIC',
    rpcUrl: 'https://polygon-mumbai-bor.publicnode.com'
  }
};

export const chainProps: Array<[chain, ChainData]> = Object.entries(chains) as Array<
  [chain, ChainData]
>;

export const currentChains = chainProps.filter(([, v]) => !v.isDev || (dev && v.isDev));

export const chainNames = currentChains.map(([c]) => c);

export const getChain = function(id: number) {
  return currentChains.find(([, v]) => v.chainId === id);
};
