<script lang="ts">
  import type { ISubscriptionManager } from '@createz/contracts/types/ethers-contracts';
  import SubscriptionContractTeaser from '../subscription/SubscriptionContractTeaser.svelte';

  export let managerContract: ISubscriptionManager;
  export let creatorTokenId: bigint;

</script>

<div class="">
  {#await managerContract.getSubscriptionContracts(creatorTokenId)}
    Loading...
  {:then contracts}
    {#each contracts as contract}
      <SubscriptionContractTeaser address={contract} />
    {/each}
  {/await}
</div>
