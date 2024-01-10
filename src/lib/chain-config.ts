import { dev } from '$app/environment';
import type { Address } from './web3/contracts/common';
import { zeroAddress } from './web3/helpers';

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
  profile: Address,
  subscriptionHandle: Address,
  erc6551Registry: Address,
  defaultErc6551Implementation: Address,
  testErc20: Address,
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
      profile: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      subscriptionHandle: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      erc6551Registry: '0x9A676e781A523b5d0C0e43731313A708CB607508',
      defaultErc6551Implementation: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
      testErc20: '0x0B306BF915C4d645ff596e518fAf3F9669b97016',
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
      profile: zeroAddress,
      subscriptionHandle: zeroAddress,
      erc6551Registry: zeroAddress,
      defaultErc6551Implementation: zeroAddress,
      testErc20: zeroAddress,
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
      profile: zeroAddress,
      subscriptionHandle: zeroAddress,
      erc6551Registry: zeroAddress,
      defaultErc6551Implementation: zeroAddress,
      testErc20: zeroAddress,
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
