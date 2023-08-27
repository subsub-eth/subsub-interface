<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Button from "../Button.svelte";
    import type { SubscriptionContractMetadata } from "$lib/web3/contracts/subscription";
    import Url from "../Url.svelte";

  export let metadata: SubscriptionContractMetadata;

  const dispatch = createEventDispatcher<{change: void}>();

</script>

<div>

<div>
  claimable: {metadata.claimable}
</div>
<div>
  total claimed: {metadata.totalClaimed}
</div>
<div>
  paused: {metadata.paused}
</div>

<Url template="/[network]/s/[subscription]/edit/" let:path >
  <Button label="Edit" href={path} />
</Url>
<Button label="Claim" />
<Button label="Pause" />

</div>
