import { dev } from '$app/environment';

export const profileContractAddr = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';
export const subscriptionManagerContractAddr = '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6';

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
      profile: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      subscriptionManager: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
      testErc20: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
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
