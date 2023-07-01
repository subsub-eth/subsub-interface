<script lang="ts">
  import { CREATOR_CONTRACT, SUBSCRIPTION_MANAGER_CONTRACT, requireContext } from '$lib/contexts';
  import type { Creator } from '@createz/contracts/types/ethers-contracts/Creator';
  import type { Readable } from 'svelte/store';
  import { page } from '$app/stores';
  import CreatorDetails from '$lib/components/creator/CreatorDetails.svelte';
  import SubscriptionContractList from '$lib/components/subscription-manager/SubscriptionContractList.svelte';
  import type { ISubscriptionManager } from '@createz/contracts/types/ethers-contracts';
  import { currentAccount } from '$lib/web3/onboard';
  import LinkButton from '$lib/components/LinkButton.svelte';
  import { addressEquals } from '$lib/web3/helpers';

  const tokenId = BigInt($page.params.creator);
  const creatorContract = requireContext<Readable<Creator>>(CREATOR_CONTRACT);
  const subscriptionManagerContract = requireContext<Readable<ISubscriptionManager>>(
    SUBSCRIPTION_MANAGER_CONTRACT
  );
</script>

<h1>Profile Details</h1>

<div class="flex flex-row space-x-4">
  <div class="basis-1/2">
    <h2>Creator</h2>
    {#if $creatorContract}
      <CreatorDetails id={tokenId} creator={$creatorContract} />
    {/if}
  </div>

  <div class="basis-1/2">
    <!-- TODO Subscription Contracts -->
    <h2>Subscription Contracts</h2>
    {#if $creatorContract}
      {#await $creatorContract.ownerOf(tokenId)}
        Loading...
      {:then owner}
        {#if addressEquals($currentAccount, owner)}
          <LinkButton text="New Subscription Contract" url={`${$page.url.pathname}new`} />
        {/if}
      {/await}
    {/if}
    <div />
    {#if $subscriptionManagerContract}
      <SubscriptionContractList
        creatorTokenId={tokenId}
        managerContract={$subscriptionManagerContract}
      />
    {/if}
  </div>
</div>
