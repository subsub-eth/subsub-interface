import { chainEnvironment } from '$lib/chain-context';
import { createQuery } from '@tanstack/svelte-query';
import { derived as derivedStore } from 'svelte/store';
import { subHandleKeys } from './keys';
import { log } from '$lib/logger';
import { totalSupply } from '$lib/web3/contracts/subscription-handle';

export function subscriptionHandleTotalSupplyQuery() {
  return createQuery<number>(
    derivedStore(chainEnvironment, (chainEnv) => ({
      queryKey: subHandleKeys.totalSupply(chainEnv!.chainData.contracts.profile),
      queryFn: async () => {
        const supply = await totalSupply(chainEnv!.subscriptionHandleContract);
        log.debug('Total supply of subscription handles', supply);
        return supply;
      }
    }))
  );
}
