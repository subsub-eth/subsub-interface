<script lang="ts">
  import type { SubscriptionTokenMetadata } from '$lib/web3/contracts/subscription';
  import Url from '../Url.svelte';

  /**
   * Address of the contract this token is defined in
   */
  export let contractAddress: string;
  export let tokenId: bigint;
  export let metadata: SubscriptionTokenMetadata;
</script>

<div class="rounded-xl border-2 border-solid p-2">
  {#if !!metadata.image}
    <img src={metadata.image} alt={metadata.name} />
  {/if}
  <div>
    Title: {metadata.name}
  </div>
  <div>
    description: {metadata.description}
  </div>
  {#if !!metadata.external_url}
    <div>
      <a href={metadata.external_url}>external url</a>
    </div>
  {/if}
  {#each metadata.attributes ?? [] as attribute}
    <div>
      {attribute.trait_type}: {attribute.value}
    </div>
  {/each}
  <div>
    <Url template={`/[network]/s/${contractAddress}/${tokenId}/`} let:path>
      <a href={path}>Details</a>
    </Url>
  </div>
</div>
