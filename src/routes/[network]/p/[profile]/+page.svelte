<script lang="ts">
  import type { PageData } from './$types';
  import { SubscriptionContractTeaser } from '$lib/components/subscription/contract';
  import { addressEquals } from '$lib/web3/helpers';
  import ProfileDetails from '$lib/components/profile/ProfileDetails.svelte';
  import Button from '$lib/components/Button.svelte';
  import { getSubscriptionContractAddresses } from '$lib/web3/contracts/subscription-handle';
  import { chainEnvironment } from '$lib/chain-context';
  import { currentAccount } from '$lib/web3/onboard';
  import { createQuery } from '@tanstack/svelte-query';
  import { derived } from 'svelte/store';
  import type { Address } from '$lib/web3/contracts/common';
  import { findProfile } from '$lib/web3/contracts/profile';
  import Url from '$lib/components/Url.svelte';
  import { PaginatedList } from '$lib/components/ui2/paginatedlist';
  import type { ProfileData } from '$lib/web3/contracts/profile';
  import { log } from '$lib/logger';
  import { findDefaultProfileErc6551Account } from '$lib/web3/contracts/erc6551';
  import { erc6551Keys, profileKeys, subHandleKeys } from '$lib/query/keys';
  import { ChevronLeft } from 'lucide-svelte';
  import { SubscriptionContractContext } from '$lib/components/context/web3';

  export let data: PageData;

  const tokenId = data.profile;

  const pageSize = 5;

  $: currentAcc = $currentAccount!;

  const profile = createQuery<ProfileData>(
    derived(chainEnvironment, (chainEnvironment) => ({
      queryKey: profileKeys.tokenUri(chainEnvironment!.chainData.contracts.profile, tokenId),
      queryFn: async () => {
        log.debug('find profile', chainEnvironment);
        const profile = await findProfile(chainEnvironment!.profileContract, tokenId);
        return profile!;
      }
    }))
  );

  const ownerAccount = createQuery<Address>(
    derived(chainEnvironment, (chainEnvironment) => ({
      queryKey: erc6551Keys.profileAccount(
        chainEnvironment!.chainData.contracts.erc6551Registry,
        chainEnvironment!.chainData.chainId,
        chainEnvironment!.chainData.contracts.profile,
        tokenId
      ),
      queryFn: async () => (await findDefaultProfileErc6551Account(chainEnvironment!, tokenId))!
    }))
  );

  const subscriptionContractAddresses = createQuery<Array<Address>>(
    derived([chainEnvironment, ownerAccount], ([chainEnvironment, ownerAccount]) => ({
      queryKey: subHandleKeys.ownerList(
        chainEnvironment!.chainData.contracts.subscriptionHandle,
        ownerAccount.data!
      ),
      queryFn: async () =>
        await getSubscriptionContractAddresses(
          chainEnvironment!.subscriptionHandleContract,
          ownerAccount.data!
        ),
      enabled: ownerAccount.isFetched && !!ownerAccount.data
    }))
  );
</script>

<h1>Profile Details</h1>

<div class="flex flex-row space-x-4">
  <div class="basis-1/2">
    <h2>Profile</h2>
    {#if $profile.isPending}
      Loading...
    {/if}
    {#if $profile.isError}
      Failed to load Profile
    {/if}
    {#if $profile.isSuccess}
      <!-- TODO "back link" to profile -->
      <Url template={`/[network]/p/${data.ownerAddress}/`} let:path>
        <a href={path}>
          <div class="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> <span>{'ownerName'}'s profile</span>
          </div>
        </a>
      </Url>

      <ProfileDetails profile={$profile.data} />
    {/if}
  </div>

  <div class="basis-1/2">
    <!-- TODO Subscription Contracts -->
    <h2>Subscription Plans</h2>
    {#if $profile.isSuccess}
      {#if addressEquals(currentAcc, $profile.data.owner)}
        <Url template={`/[network]/p/${tokenId}/newsub/`} let:path>
          <Button primary={true} label="New Subscription Contract" href={path} />
        </Url>
      {/if}
    {/if}
    <div />
    <!-- TODO FIXME -->
    {#if $subscriptionContractAddresses.isPending}
      Loading ...
    {/if}
    {#if $subscriptionContractAddresses.isError}
      Failed to load {$subscriptionContractAddresses.error}
    {/if}
    {#if $subscriptionContractAddresses.isSuccess}
      <PaginatedList {pageSize} items={$subscriptionContractAddresses.data} let:currentItems>
        {#each currentItems as planAddr}
          <SubscriptionContractContext address={planAddr} let:subscriptionData let:erc20Data let:tokenPrice>
            {#if subscriptionData.isPending || erc20Data.isPending}
              ... Loading ...
            {/if}
            {#if subscriptionData.isSuccess && erc20Data.isSuccess}
              <SubscriptionContractTeaser
                contractData={subscriptionData.data}
                paymentTokenData={erc20Data.data}
                tokenPrice={tokenPrice}
              />
            {/if}
          </SubscriptionContractContext>
        {/each}
      </PaginatedList>
    {/if}
  </div>
</div>
