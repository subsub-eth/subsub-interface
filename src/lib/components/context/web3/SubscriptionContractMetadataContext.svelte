<script lang="ts">
  import type { SubscriptionTokenMetadata } from '$lib/web3/contracts/subscription';
  import { decodeDataJsonTokenURI } from '$lib/web3/helpers';
  import type { Subscription } from '@createz/contracts/types/ethers-contracts';

  export let contract: Subscription;

  let counter = 0;

  let address: string;
  let metadata: SubscriptionTokenMetadata;

  $: (async () => {
    address = await contract.getAddress();
  })();

  $: (async () => {
    counter;
    const encoded = await contract.contractURI();
    metadata = decodeDataJsonTokenURI<SubscriptionTokenMetadata>(encoded);
  })();

  const update = async () => {
    counter++;
  };
</script>

{#if address && metadata}
  <slot {address} {metadata} {update} />
{:else}
  Loading contract metadata
{/if}
