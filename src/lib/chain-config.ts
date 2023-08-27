import { dev } from '$app/environment';

export interface Chains {
  localhost: ChainData;
  polygon: ChainData;
  'polygon-mumbai': ChainData;
}

export interface ChainData {
  isDev: boolean;
  isTest: boolean;
  displayName: string;
  chainId: number;
  token: string;
  rpcUrl: string;
  contracts: ContractAddresses;
}

export interface ContractAddresses {
  profile: string,
  subscriptionManager: string,
  testErc20: string,
}

export type chain = keyof Chains;

const chains: Chains = {
  localhost: {
    isDev: true,
    isTest: true,
    displayName: 'Localhost',
    chainId: 31337,
    token: 'ETH',
    rpcUrl: 'http://localhost:8545',
    contracts : {
      profile: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      subscriptionManager: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
      testErc20: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
    }
  },
  polygon: {
    isTest: false,
    isDev: false,
    displayName: 'Polygon PoS Mainnet',
    chainId: 137,
    token: 'MATIC',
    rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
    contracts : {
      profile: '',
      subscriptionManager: '',
      testErc20: '',
    }
  },
  'polygon-mumbai': {
    isDev: false,
    isTest: true,
    displayName: 'Polygon Mumbai Testnet',
    chainId: 80001,
    token: 'MATIC',
    rpcUrl: 'https://polygon-mumbai-bor.publicnode.com',
    contracts : {
      profile: '',
      subscriptionManager: '',
      testErc20: '',
    }
  }
};

const chainProps: Array<[chain, ChainData]> = Object.entries(chains) as Array<
  [chain, ChainData]
>;

export const currentChains = chainProps.filter(([, v]) => !v.isDev || (dev && v.isDev));

export const chainNames = currentChains.map(([c]) => c);

export const getChain = function(id: number) {
  return currentChains.find(([, v]) => v.chainId === id);
};

export const getChainByName = function(name: string): ChainData | undefined {
  const val = currentChains.find(([k,]) => k === name);

  return val ? val[1] : undefined;
}
