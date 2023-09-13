<script lang="ts">
  import { truncateAddress } from '$lib/helpers';
  import type { SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';
  import Url from '../Url.svelte';

  export let address: string;
  export let metadata: SubscriptionContractMetadata;
</script>

<div
  class="max-w-md max-h-48 backdrop-blur-sm bg-primary-purple1/[0.15] ring-primary-purple1/[0.15] rounded-xl ring-2 ring-inset"
>
  <div class="grid grid-cols-6 grid-rows-3 items-center gap-4">
    <img
      class="row-span-2 max-w-28 max-h-28 aspect-square rounded-lg overflow-hidden drop-shadow-lg pl-4"
      src={metadata.image}
      alt={metadata.name}
    />
    <div class="col-span-4 row-span-2 text-white">
      <h5 class="font-bold">
        {metadata.name}
      </h5>
      <p class="line-clamp-2">
        {metadata.description}
      </p>
      <dl class="flex-1 text-white">
        <div class="flex flex-row max-w-xs">
          <dt class="basis-1/2 after:content-[':']">Owner</dt>
          <dd class="basis-1/2">TODO OWNER</dd>
        </div>
      </dl>
    </div>
    <div class="">
      Alerts
    </div>
    <div class="row-span-2">
      <Url template={`/[network]/s/${address}/`} let:path>
        <a href={path}>Details</a>
      </Url>
    </div>
    <div class="col-start-2 col-span-4 flex flex-row">
      <dl class="flex-1 text-white">
        <div class="flex flex-row max-w-xs">
          <dt class="basis-1/2">External Link</dt>
          <dd class="basis-1/2"><a href={metadata.external_url}>external url</a></dd>
        </div>
        <div class="flex flex-row max-w-xs">
          <dt class="basis-1/2">Token</dt>
          <dd class="basis-1/2">{truncateAddress(metadata.token)}</dd>
        </div>
      </dl>
    </div>
  </div>
</div>
