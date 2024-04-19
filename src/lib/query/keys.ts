import type { Address } from '$lib/web3/contracts/common';
import type { SubscriptionContractData } from '$lib/web3/contracts/subscription';
import objectHash from 'object-hash';

const ERC6551_ACCOUNT = 'erc6551account';
const ERC6551_REGISTRY = 'erc6551registry';
const SUB_HANDLE = 'subHandle';
const SUBSCRIPTION = 'subscription';
const CONTRACT = 'contract';
const PROFILE = 'profile';
const ERC20 = 'erc20';
export const LIST = 'list';
const TOTAL_SUPPLY = 'totalSupply';
const DATA = 'tokenUri';
const CONTRACT_DATA = 'contractUri';
const PRICE = 'price';
const ALLOWANCE = 'allowance';
const BALANCE = 'balance';
const WARNINGS = 'warnings';
const TOKEN_SEARCH = 'tokenSearch';
const GLOBAL = 'global';

function key(...keys: (string | undefined)[]): string[] {
  return keys.filter((s) => s) as string[];
}

function hash(val: unknown): string {
  return objectHash(val ?? '');
}
// TODO Review keys and queries to actually depend on data for refresh

export const erc20Keys = {
  contract: (address?: Address) => key(ERC20, address),
  metadata: (address?: Address) => key(ERC20, address, CONTRACT_DATA),
  allowance: (address?: Address, owner?: Address, spender?: Address) =>
    key(ERC20, address, ALLOWANCE, owner, spender),
  balance: (address?: Address, owner?: Address) => key(ERC20, address, BALANCE, owner),
  price: (address?: Address) => key(ERC20, address, PRICE)
};

export const subHandleKeys = {
  ownerList: (contract?: Address, owner?: Address) => key(SUB_HANDLE, contract, DATA, owner)
};

export const subKeys = {
  contract: (address?: Address) => key(SUBSCRIPTION, address),
  contractUri: (contract?: Address) => key(SUBSCRIPTION, contract, CONTRACT_DATA),
  warnings: (contractData: SubscriptionContractData) =>
    key(SUBSCRIPTION, contractData?.address, CONTRACT_DATA, WARNINGS, hash(contractData ?? '')),
  tokenUri: (contract?: Address, tokenId?: bigint) =>
    key(SUBSCRIPTION, contract, DATA, tokenId?.toString()),
  balance: (contract?: Address, owner?: Address) => key(SUBSCRIPTION, contract, BALANCE, owner),
  ownerList: (contract?: Address, owner?: Address) => key(SUBSCRIPTION, contract, owner),
  totalSupply: (contract?: Address) => key(SUBSCRIPTION, contract, TOTAL_SUPPLY)
};

export const profileKeys = {
  totalSupply: (contract?: Address) => key(PROFILE, contract, TOTAL_SUPPLY),
  balance: (contract?: Address, owner?: Address) => key(PROFILE, contract, BALANCE, owner),
  ownerList: (contract?: Address, owner?: Address) => key(PROFILE, contract, DATA, owner),
  list: (contract?: Address) => key(PROFILE, contract, BALANCE, GLOBAL),
  tokenUri: (contract?: Address, tokenId?: bigint) =>
    key(PROFILE, contract, DATA, tokenId?.toString()),
  tokenOwner: (contract?: Address, tokenId?: bigint, account?: Address) =>
    key(PROFILE, contract, DATA, tokenId?.toString(), account)
};

export const erc6551Keys = {
  profileAccount: (
    erc6551Registry?: Address,
    chainId?: number,
    profile?: Address,
    tokenId?: bigint
  ) => key(ERC6551_REGISTRY, erc6551Registry, String(chainId), profile, tokenId?.toString()),

  account: (account: Address) => key(ERC6551_ACCOUNT, account)
};

export const tokenSearch = (searchTerm: string) => key(TOKEN_SEARCH, ERC20, searchTerm);
