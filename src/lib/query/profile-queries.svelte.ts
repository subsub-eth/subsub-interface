import { chainEnvironment } from '$lib/chain-context';
import { log } from '$lib/logger';
import { profileKeys } from '$lib/query/keys';
import { totalSupply } from '$lib/web3/contracts/profile';
import { createQuery } from '@tanstack/svelte-query';
import { derived as derivedStore } from 'svelte/store';

export function profileTotalSupplyQuery() {
  return createQuery<number>(
    derivedStore(chainEnvironment, (chainEnv) => ({
      queryKey: profileKeys.totalSupply(chainEnv!.chainData.contracts.profile),
      queryFn: async () => {
        const supply = await totalSupply(chainEnv!.profileContract);
        log.debug('Total supply of profiles', supply);
        return supply;
      }
    }))
  );
}
