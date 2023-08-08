<script lang="ts">
  import type { SubscriptionTokenMetadata } from '$lib/web3/contracts/subscription';

  export let address: string;
  export let metadata: SubscriptionTokenMetadata;
</script>

<div>
  <div>address: {address}</div>
  <img src={metadata.image} alt={metadata.name} />
  <div>
    Title: {metadata.name}
  </div>
  <div>
    description: {metadata.description}
  </div>
  <div>
    <a href={metadata.external_url}>external url</a>
  </div>
  {#each metadata.attributes ?? [] as attribute}
    <div>
      {attribute.trait_type}: {attribute.value}
    </div>
  {/each}
</div>
