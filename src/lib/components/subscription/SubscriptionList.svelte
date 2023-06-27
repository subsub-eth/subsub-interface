<script lang="ts">
  import type { Subscription } from '@createz/contracts/types/ethers-contracts';
  import SubscriptionTeaser from './SubscriptionTeaser.svelte';

  export let contract: Subscription;
  export let account: string;

  const subIds = async () => {
    const balance = await contract.balanceOf(account);

    console.log("sub balance", balance);

    const range = Array.from(Array(Number(balance)).keys());

    console.log('range', range);
    return Promise.all(range.map((i) => contract.tokenOfOwnerByIndex(account, i)));
  };
</script>

<div>
  {#await subIds()}
    Loading Subscriptions...
  {:then subIds}
    {#each subIds as tokenId}
      <SubscriptionTeaser {contract} {tokenId} />
    {/each}
  {:catch err}
    failed to load subscrptions {err}
  {/await}
</div>
