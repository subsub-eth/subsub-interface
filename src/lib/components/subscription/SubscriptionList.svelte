<script lang="ts">
  import SubscriptionTeaser from './SubscriptionTeaser.svelte';
  import type { SubscriptionTokenMetadata } from '$lib/web3/contracts/subscription';

  export let pages: number;
  export let loadSubscriptions: (
    page: number
  ) => Promise<Array<[string, bigint, SubscriptionTokenMetadata]>>;
  let currentPage = 0;
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
    <div>Page: {currentPage + 1} / {pages}</div>
  {/if}
</div>
