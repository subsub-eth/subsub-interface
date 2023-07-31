<script lang="ts">
  import { PROFILE_CONTRACT, SUBSCRIPTION_MANAGER_CONTRACT, requireContext } from '$lib/contexts';
  import type { Readable } from 'svelte/store';
  import { page } from '$app/stores';
  import SubscriptionContractList from '$lib/components/subscription-manager/SubscriptionContractList.svelte';
  import type { ISubscriptionManager, Profile } from '@createz/contracts/types/ethers-contracts';
  import { currentAccount } from '$lib/web3/onboard';
  import { addressEquals } from '$lib/web3/helpers';
  import ProfileDetails from '$lib/components/profile/ProfileDetails.svelte';
    import Button from '$lib/components/Button.svelte';

  const tokenId = BigInt($page.params.profile);
  const profileContract = requireContext<Readable<Profile>>(PROFILE_CONTRACT);
  const subscriptionManagerContract = requireContext<Readable<ISubscriptionManager>>(
    SUBSCRIPTION_MANAGER_CONTRACT
  );
</script>

<h1>Profile Details</h1>

<div class="flex flex-row space-x-4">
  <div class="basis-1/2">
    <h2>Profile</h2>
    {#if $profileContract}
      <ProfileDetails id={tokenId} profile={$profileContract} />
    {/if}
  </div>

  <div class="basis-1/2">
    <!-- TODO Subscription Contracts -->
    <h2>Subscription Contracts</h2>
    {#if $profileContract}
      {#await $profileContract.ownerOf(tokenId)}
        Loading...
      {:then owner}
        {#if addressEquals($currentAccount, owner)}
          <Button primary={true} label="New Subscription Contract" href={`${$page.url.pathname}newsub/`} />
        {/if}
      {/await}
    {/if}
    <div />
    {#if $subscriptionManagerContract}
      <SubscriptionContractList
        profileTokenId={tokenId}
        managerContract={$subscriptionManagerContract}
      />
    {/if}
  </div>
</div>
