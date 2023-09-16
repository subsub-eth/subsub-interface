<script lang="ts">
  import type { SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';
  import SubscriptionContractTeaser from '$lib/components/subscription/SubscriptionContractTeaser.svelte';
  import Paging from '../Paging.svelte';

  export let pages: number;
  export let load: (
    page: number
  ) => Promise<Array<[string, SubscriptionContractMetadata | undefined]>>;

  let currentPage = 0;

  const setPage = (newPage: number) => (currentPage = newPage);
</script>

<div>
  {#if pages == 0}
    No Contracts
  {:else}
    {#await load(currentPage)}
      Loading Contracts ...
    {:then data}
      {#each data as [address, metadata]}
        {#if metadata}
          <SubscriptionContractTeaser {address} {metadata} />
        {:else}
          <div>Failed to load contract data from {address}</div>
        {/if}
      {/each}
    {:catch err}
      failed to load contracts {err}
    {/await}
    <Paging current={currentPage} size={pages} {setPage} />
  {/if}
</div>
