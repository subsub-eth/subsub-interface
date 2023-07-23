<script lang="ts">
  import { profileContractAddr, subscriptionManagerContractAddr } from '$lib/chain-config';
  import { isAccountConnected } from '$lib/web3/onboard';
  import { setContext } from 'svelte';
  import type { LayoutData } from './$types';
  import { ethersSigner } from '$lib/web3/ethers';
  import { readonly, writable, type Writable } from 'svelte/store';
  import { PROFILE_CONTRACT, SUBSCRIPTION_MANAGER_CONTRACT } from '$lib/contexts';
  import {
    type ISubscriptionManager,
    ISubscriptionManager__factory,

    type Profile,

    Profile__factory


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
  const profileStore = createStore<Profile>(PROFILE_CONTRACT);
  $: {
    const signer = $ethersSigner;
    if (!!signer) {
      const manager = ISubscriptionManager__factory.connect(
        subscriptionManagerContractAddr,
        $ethersSigner
      );
      console.log(`setting sub manager to context: `, manager);
      managerStore.set(manager);

      const profile = Profile__factory.connect(profileContractAddr, $ethersSigner);
      console.log(`setting profile contract to context: `, profile);
      profileStore.set(profile);
    }
  }

  // TODO distinguish provider and signer
</script>

{#if $isAccountConnected}
  <slot />
{:else}
  <div>please connect</div>
{/if}
