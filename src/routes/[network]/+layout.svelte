<script lang="ts">
  import { type chain, getChainByName } from '$lib/chain-config';
  import { isAccountConnected } from '$lib/web3/onboard';
  import { setContext } from 'svelte';
  import type { LayoutData } from './$types';
  import { ethersSigner } from '$lib/web3/ethers';
  import { readonly, writable, type Writable } from 'svelte/store';
  import { PROFILE_CONTRACT, SUBSCRIPTION_HANDLE_CONTRACT } from '$lib/contexts';
  import {
    type Profile,
    Profile__factory,
    type ISubscriptionHandle,
    ISubscriptionHandle__factory
  } from '@createz/contracts/types/ethers-contracts';
  import SubscriptionContractList from '$lib/components/subscription-manager/SubscriptionContractList.svelte';

  export let data: LayoutData;

  // assuming that LayoutData provides a validated value
  const network: chain = data.network;
  if (network) {
    setContext('network', data.network);
  }

  function createStore<T>(name: string): Writable<T> {
    const store = writable<T>();
    const readStore = readonly(store);
    setContext(name, readStore);
    return store;
  }

  const subHandleStore = createStore<ISubscriptionHandle>(SUBSCRIPTION_HANDLE_CONTRACT);
  const profileStore = createStore<Profile>(PROFILE_CONTRACT);
  $: {
    const signer = $ethersSigner;
    const chain = getChainByName(network);

    console.log(`initializing network layout`, 1, signer, 2, network, 3,  chain?.chainId);

    if (signer && chain) {
      const contracts = chain.contracts;
      console.log(`initializing with contracts`, contracts);
      const subHandle = ISubscriptionHandle__factory.connect(
        contracts.subscriptionHandle,
        $ethersSigner
      );
      console.log(`setting subscription handle to context: `, subHandle);
      subHandleStore.set(subHandle);

      const profile = Profile__factory.connect(contracts.profile, $ethersSigner);
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
