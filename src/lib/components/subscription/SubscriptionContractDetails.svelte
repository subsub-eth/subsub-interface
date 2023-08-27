<script lang="ts">
  import type { SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';

  export let address: string;
  export let metadata: SubscriptionContractMetadata;
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
  <div>
    token: {metadata.token}
  </div>
  <div>
    rate: {metadata.rate}
  </div>
</div>
