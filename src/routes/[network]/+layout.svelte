<script lang="ts">
  import { creatorContractAddr, subscriptionManagerContractAddr } from '$lib/chain-config';
  import { isAccountConnected } from '$lib/web3/onboard';
  import { setContext } from 'svelte';
  import type { LayoutData } from './$types';
  import { Creator__factory } from '@createz/contracts/types/ethers-contracts/factories/Creator__factory';
  import { ethersProvider, ethersSigner } from '$lib/web3/ethers';
  import { readonly, writable, type Writable } from 'svelte/store';
  import type { Creator } from '@createz/contracts/types/ethers-contracts/Creator';
  import { CREATOR_CONTRACT, SUBSCRIPTION_MANAGER_CONTRACT } from '$lib/contexts';
  import {
    type ISubscriptionManager,
    ISubscriptionManager__factory
  } from '@createz/contracts/types/ethers-contracts';

  export let data: LayoutData;

  const network = data.network;
  if (!!network) {
    setContext('network', data.network);
  }

  function createStore<T>(name: string): Writable<T> {
    const store = writable<T>();
    const readStore = readonly(store);
    setContext(name, readStore);
    return store;
  }

  const managerStore = createStore<ISubscriptionManager>(SUBSCRIPTION_MANAGER_CONTRACT);
  const creatorStore = createStore<Creator>(CREATOR_CONTRACT);
  $: {
    const signer = $ethersSigner;
    if (!!signer) {
      const manager = ISubscriptionManager__factory.connect(
        subscriptionManagerContractAddr,
        $ethersSigner
      );
      console.log(`setting sub manager to context: `, manager);
      managerStore.set(manager);

      const creator = Creator__factory.connect(creatorContractAddr, $ethersSigner);
      console.log(`setting creator contract to context: `, creator);
      creatorStore.set(creator);
    }
  }

  // TODO distinguish provider and signer
</script>

{#if $isAccountConnected}
  <slot />
{:else}
  <div>please connect</div>
{/if}
