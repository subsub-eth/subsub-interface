<script lang="ts">
  import SubscriptionTeaser from './SubscriptionTeaser.svelte';
  import type { SubscriptionTokenMetadata } from '$lib/web3/contracts/subscription';
  import Paging from '../Paging.svelte';

  export let pages: number;
  export let loadSubscriptions: (
    page: number
  ) => Promise<Array<[string, bigint, SubscriptionTokenMetadata]>>;
  let currentPage = 0;

  const setPage = (newPage: number) => (currentPage = newPage);
</script>

<div>
  {#if pages == 0}
    No Subscriptions
  {:else}
    {#await loadSubscriptions(currentPage)}
      Loading Subscriptions ...
    {:then data}
      {#each data as [contractAddress, tokenId, metadata]}
        <SubscriptionTeaser {contractAddress} {tokenId} {metadata} />
      {/each}
    {:catch err}
      failed to load subscrptions {err}
    {/await}
    <Paging current={currentPage} size={pages} {setPage} />
  {/if}
</div>
