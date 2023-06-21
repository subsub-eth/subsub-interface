<script lang="ts">
  import type { ISubscriptionManager } from '@createz/contracts/types/ethers-contracts';

  export let managerContract: ISubscriptionManager;
  export let creatorTokenId: bigint;

  const getContracts = async () => {
    const contracts = await managerContract.getSubscriptionContracts(creatorTokenId);
    console.log(`subscription contracts: ${JSON.stringify(contracts)}`, contracts);
    return contracts;
  }

</script>

<div>

{#await getContracts()}
Loading...
{:then contracts}
{#each contracts as contract}
  '{contract}'
{/each}

{/await}

</div>
