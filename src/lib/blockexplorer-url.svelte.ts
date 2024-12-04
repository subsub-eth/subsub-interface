import { addressUrl, nftUrl as internalNftUrl, tokenUrl as internalTokenUrl } from '$lib/web3/blockexplorer';
import { getContext } from 'svelte';
import { EXPLORER_URL } from '$lib/contexts';
import { log } from '$lib/logger';
import type { Address } from '$lib/web3/contracts/common';
import { fromStore } from 'svelte/store';
import { chainEnvironment } from './chain-context';

function getExplorer(): string {

  const explorer: string = getContext(EXPLORER_URL)
    ?? fromStore(chainEnvironment).current?.chainData.explorerUrl;
  if (!explorer) {
    const msg = 'Explorer Url not defined';
    log.error(msg);
    throw new Error(msg);
  }

  return explorer;
}

export function accountUrl(address: Address): string {
  const explorer = getExplorer();

  return addressUrl(explorer, address);
}

export function nftUrl(address: Address, tokenId: bigint): string {
  const explorer = getExplorer();

  return internalNftUrl(explorer, address, tokenId);
}

export function tokenUrl(contract: Address): string {
  const explorer = getExplorer();

  return internalTokenUrl(explorer, contract);
}
