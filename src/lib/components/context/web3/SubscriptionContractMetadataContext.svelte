<script lang="ts">
  import { contractMetadata, type SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';
  import type { Subscription } from '@createz/contracts/types/ethers-contracts';

  export let contract: Subscription;

  let counter = 0;

  let address: string;
  let metadata: SubscriptionContractMetadata;

  $: (async () => {
    address = await contract.getAddress();
  })();

  $: (async () => {
    counter;
    metadata = await contractMetadata(contract);
  })();

  const update = async () => {
    counter++;
  };
</script>

{#if address && metadata}
  <slot {address} {metadata} {update} />
{:else}
  Loading contract metadata
{/if}
