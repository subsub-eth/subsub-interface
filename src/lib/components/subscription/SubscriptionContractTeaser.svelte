<script lang="ts">
  import { NETWORK, requireContext } from '$lib/contexts';
  import type { SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';

  export let address: string;
  export let metadata: SubscriptionContractMetadata;

  // TODO better way to generate links?
  const network = requireContext<string>(NETWORK);
</script>

<div class="rounded-xl border-2 border-solid p-2">
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
  <div>
    <a href={`/${network}/s/${address}/`}>Details</a>
  </div>
</div>
