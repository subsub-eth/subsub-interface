<script lang="ts">
  import { Subscription__factory } from '@createz/contracts/types/ethers-contracts';
  import type { PageData } from './$types';
  import { ethersSigner } from '$lib/web3/ethers';
  import SubscriptionContractDetails from '$lib/components/subscription/SubscriptionContractDetails.svelte';
  import SubscriptionList from '$lib/components/subscription/SubscriptionList.svelte';
  import { currentAccount } from '$lib/web3/onboard';
  import { page } from '$app/stores';

  export let data: PageData;

  const addr = data.subscriptionAddr;

  $: subContract = !!$ethersSigner ? Subscription__factory.connect(addr, $ethersSigner) : null;

  // TODO contract is paused
</script>

<h1>Subscription Contract Details page</h1>

Subscription Contract: {addr}

<div class="flex flex-row space-x-4">
  {#if !!subContract}
    <div class="basis-1/2">
      <!-- LEFT -->
      <div class="rounded-xl border-2 border-solid p-2">
        <!-- creator teaser -->
        {#await subContract.owner()}
          Loading...
        {:then [ownerContract, ownerId]}
          Contract owner: {ownerContract} : {ownerId}
          <!-- TODO check owner contract otherwise print warning -->
        {:catch err}
          Failed to load owner {err}
        {/await}
      </div>
      <div class="rounded-xl border-2 border-solid p-2">
        <!-- sub details -->
        <SubscriptionContractDetails contract={subContract} />
      </div>
    </div>

    <div class="basis-1/2">
      <!-- RIGHt -->
      <!-- mint subscription -->
      <!-- TODO Fix me -->
      <h2>My Subscrptions</h2>
      <div>
        <a href={$page.url.pathname + 'new/'}>mint new Subscription</a>
      </div>
      {#if !!$currentAccount}
        <SubscriptionList contract={subContract} account={$currentAccount} />
      {/if}
    </div>
  {/if}
</div>
