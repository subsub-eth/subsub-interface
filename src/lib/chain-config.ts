import { dev } from '$app/environment';
import type { Address } from './web3/contracts/common';
import type { Erc20Token } from './web3/contracts/erc20';
import { zeroAddress } from './web3/helpers';

export interface Chains {
  localhost: ChainData;
  base: ChainData;
  polygon: ChainData;
  'base-sepolia': ChainData;
}

export interface ChainData {
  isDev: boolean;
  isTest: boolean;
  displayName: string;
  chainId: number;
  token: string;
  rpcUrl: string;
  explorerUrl: string;
  contracts: ContractAddresses;
}

export type PriceFeeds = Record<Address, Address>;

export interface ContractAddresses {
  profile: Address;
  subscriptionHandle: Address;
  erc6551Registry: Address;
  defaultErc6551Implementation: Address;
  testErc20: Address;
  priceFeeds: PriceFeeds;
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
    explorerUrl: 'https://etherscan.io',
    contracts: {
      profile: '0xf983714d87AFE606D38571759138ee088dbFc5da',
      subscriptionHandle: '0x38A0759EdBe82E3A53405dF797be4d24C5f4C94f',
      erc6551Registry: '0xe5807706A0d8fBb97ADAD8187241aA3a5E09f974',
      defaultErc6551Implementation: '0x8dA7166a4316fA5fc36010F0C7F14676AfC65507',
      testErc20: '0xea9c5c286D93324C9643A8C4c0b1D95BeD451e66',
      priceFeeds: {
        '0xea9c5c286D93324C9643A8C4c0b1D95BeD451e66': '0x0C99B8449108DD3C047195f2e4E0a43D122aa505'
      }
    }
  },
  base: {
    isTest: false,
    isDev: false,
    displayName: 'Base',
    chainId: 8453,
    token: 'ETH',
    rpcUrl: 'https://base.llamarpc.com',
    explorerUrl: 'https://basescan.org',
    contracts: {
      profile: zeroAddress,
      subscriptionHandle: zeroAddress,
      erc6551Registry: zeroAddress,
      defaultErc6551Implementation: zeroAddress,
      testErc20: zeroAddress,
      priceFeeds: {}
    }
  },
  polygon: {
    isTest: false,
    isDev: false,
    displayName: 'Polygon PoS Mainnet',
    chainId: 137,
    token: 'MATIC',
    rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
    explorerUrl: 'https://polygonscan.com',
    contracts: {
      profile: zeroAddress,
      subscriptionHandle: zeroAddress,
      erc6551Registry: zeroAddress,
      defaultErc6551Implementation: zeroAddress,
      testErc20: zeroAddress,
      priceFeeds: {}
    }
  },
  'base-sepolia': {
    isDev: false,
    isTest: true,
    displayName: 'Base Sepolia Testnet',
    chainId: 84532,
    token: 'ETH',
    rpcUrl: 'https://sepolia.base.org',
    explorerUrl: 'https://sepolia.basescan.org/',
    contracts: {
      profile: zeroAddress,
      subscriptionHandle: zeroAddress,
      erc6551Registry: zeroAddress,
      defaultErc6551Implementation: zeroAddress,
      testErc20: zeroAddress,
      priceFeeds: {}
    }
  }
};

const chainProps: Array<[chain, ChainData]> = Object.entries(chains) as Array<[chain, ChainData]>;

export const currentChains = chainProps.filter(([, v]) => !v.isDev || (dev && v.isDev));

export const chainNames = currentChains.map(([c]) => c);

export const getChain = function (id: number) {
  return currentChains.find(([, v]) => v.chainId === id);
};

export const getChainByName = function (name: string): ChainData | undefined {
  const val = currentChains.find(([k]) => k === name);

  return val ? val[1] : undefined;
};

// TODO refactor
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const knownErc20Tokens = (chainId: number): Array<Erc20Token> => {
  // TODO proper implementation
  return [
    { address: '0xea9c5c286D93324C9643A8C4c0b1D95BeD451e66', symbol: 'TestUSD', name: 'test USD' },
    { address: '0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863a1', symbol: 'INV1', name: 'invalid 1' },
    { address: '0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863a2', symbol: 'INV2', name: 'invalid 2' },
    { address: '0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863a3', symbol: 'INV3', name: 'invalid 3' },
    { address: '0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863a4', symbol: 'INV4', name: 'invalid 4' },
    { address: '0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863a5', symbol: 'INV5', name: 'invalid 5' }
  ];
};
