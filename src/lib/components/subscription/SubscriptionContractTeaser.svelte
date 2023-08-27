<script lang="ts">
  import type { SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';
  import Url from '../Url.svelte';

  export let address: string;
  export let metadata: SubscriptionContractMetadata;
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
  <div>
    token: {metadata.token}
  </div>
  <div>
    <Url template={`/[network]/s/${address}/`} let:path>
      <a href={path}>Details</a>
    </Url>
  </div>
</div>
