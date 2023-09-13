<script lang="ts">
  import { contractMetadata, type SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';
  import type { Subscription } from '@createz/contracts/types/ethers-contracts';

  export let contract: Subscription;

  let address: string;
  let metadata: SubscriptionContractMetadata;

  let loading = true;

  const loadData = async (contract: Subscription) => {
    loading = true;
    metadata = await contractMetadata(contract);
    loading = false;
  }

  $: (async () => {
    address = await contract.getAddress();
  })();

  $: loadData(contract);

  const update = async () => {
    await loadData(contract);
  };
</script>

{#if address && metadata}
  <slot {address} {metadata} {loading} {update} />
{:else}
  Loading contract metadata
{/if}
