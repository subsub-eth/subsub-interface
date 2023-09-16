<script lang="ts">
  import {
    contractMetadata,
    type SubscriptionContractMetadata
  } from '$lib/web3/contracts/subscription';
  import type { Subscription } from '@createz/contracts/types/ethers-contracts';

  export let contract: Subscription;

  let address: string;
  let metadata: SubscriptionContractMetadata;

  let loading = true;
  let isError = false;

  const loadData = async (contract: Subscription) => {
    loading = true;
    try {
      metadata = await contractMetadata(contract);
      isError = false;
    } catch (err) {
      isError = true;
      console.error('Failed to load metadata from contract', contract);
    } finally {
      loading = false;
    }
  };

  $: (async () => {
    address = await contract.getAddress();
  })();

  $: loadData(contract);

  const update = async () => {
    await loadData(contract);
  };
</script>

{#if isError}
  An Error occurred while load the subscription contract data.
{:else if address && metadata}
  <slot {address} {metadata} {loading} {update} />
{:else}
  Loading contract metadata
{/if}
