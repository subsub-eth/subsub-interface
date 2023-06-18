<script lang="ts">
  import { creatorContractAddr } from '$lib/chain-config';
  import { isAccountConnected } from '$lib/web3/onboard';
  import { setContext } from 'svelte';
  import type { LayoutData } from './$types';
  import { Creator__factory } from '@createz/contracts/types/ethers-contracts/factories/Creator__factory';
  import { ethersProvider, ethersSigner } from '$lib/web3/ethers';
  import { readonly, writable } from 'svelte/store';
  import type { Creator } from '@createz/contracts/types/ethers-contracts/Creator';
  import { CREATOR_CONTRACT } from '$lib/contexts';

  export let data: LayoutData;

  const network = data.network;
  if (!!network) {
    setContext('network', data.network);
  }

  const creatorStore = writable<Creator>();

  const creatorReadStore = readonly(creatorStore);
  setContext(CREATOR_CONTRACT, creatorReadStore);

  // TODO distinguish provider and signer
  $: creator = Creator__factory.connect(creatorContractAddr, $ethersSigner);

  $: {
    creatorStore.set(creator);
  }
</script>

{#if $isAccountConnected}
  <slot />
{:else}
  <div>please connect</div>
{/if}
