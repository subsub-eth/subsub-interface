import {
  findDefaultProfileErc6551Account,
  getErc6551Account,
  type TokenBoundAccount
} from '$lib/web3/contracts/erc6551';
import { createQuery, type QueryObserverResult } from '@tanstack/svelte-query';
import { derived, type Readable } from 'svelte/store';
import type { Address } from '$lib/web3/contracts/common';

import { chainEnvironment } from '$lib/chain-context';

/**
  * @deprecated
*/
export const profileErc6551AccountAddress = (tokenId: bigint) => {
  return createQuery<Address>(
    derived(chainEnvironment, (chainEnvironment) => ({
      queryKey: ['profileAccount', tokenId.toString()],
      queryFn: async () => {
        const acc = await findDefaultProfileErc6551Account(chainEnvironment!, tokenId);
        return acc!;
      }
    }))
  );
};

/**
  * @deprecated
*/
export const profileErc6551Account = (
  accountAddress: Readable<QueryObserverResult<Address>>
) => {
  return createQuery<TokenBoundAccount | null>(
    derived([chainEnvironment, accountAddress], ([chainEnvironment, addr]) => ({
      queryKey: ['erc6551Account', addr.data /** chainId, stuff */],
      queryFn: async () => {
        const signer = chainEnvironment!.ethersSigner;
        const account = getErc6551Account(addr.data!, signer);
        return account;
      },
      enabled: addr.isSuccess && !!addr.data
    }))
  );
};

export const createProfileErc6551Account = () => {}
