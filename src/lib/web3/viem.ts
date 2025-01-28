import {
  type PublicClient,
  type WalletClient,
  type Chain,
  type Transport,
  type Account
} from 'viem';

import type { Address } from './contracts/common';

export type ReadClient = PublicClient<Transport, Chain>;
export type WriteClient = WalletClient<Transport, Chain, Account>;

export interface ReadableContract {
  address: Address;
  publicClient: ReadClient;
}

export interface WritableContract extends ReadableContract {
  walletClient: WriteClient;
}

export async function switchChain(client: WriteClient, chainId: number) {
  return await client.switchChain({ id: chainId });
}
