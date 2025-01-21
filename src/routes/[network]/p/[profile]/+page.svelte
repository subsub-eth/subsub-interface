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
  import { derived as derivedStore } from 'svelte/store';
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
  import { getChainId } from '$lib/chain-config';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const tokenId = data.profile;

  const pageSize = 5;

  let currentAcc = $derived($currentAccount!);

  const profile = createQuery<ProfileData>(
    derivedStore(chainEnvironment, (chainEnvironment) => ({
      queryKey: profileKeys.tokenUri(chainEnvironment?.chainData.contracts.profile, tokenId),
      queryFn: async () => {
        log.debug('find profile', chainEnvironment);
        const profile = await findProfile(chainEnvironment!.profileContract, tokenId);
        return profile!;
      },
      enabled: !!chainEnvironment
    }))
  );

  const ownerAccount = createQuery<Address>(
    derivedStore(chainEnvironment, (chainEnvironment) => ({
      queryKey: erc6551Keys.profileAccount(
        chainEnvironment?.chainData.contracts.erc6551Registry,
        getChainId(chainEnvironment?.chainData),
        chainEnvironment?.chainData.contracts.profile,
        tokenId
      ),
      queryFn: async () => (await findDefaultProfileErc6551Account(chainEnvironment!, tokenId))!,
      enabled: !!chainEnvironment
    }))
  );

  const subscriptionContractAddresses = createQuery<Array<Address>>(
    derivedStore([chainEnvironment, ownerAccount], ([chainEnvironment, ownerAccount]) => ({
      queryKey: subHandleKeys.ownerList(
        chainEnvironment?.chainData.contracts.subscriptionHandle,
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
      <Url template={`/[network]/p/${data.ownerAddress}/`}>
        {#snippet children({ path })}
          <a href={path}>
            <div class="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" /> <span>{'ownerName'}'s profile</span>
            </div>
          </a>
        {/snippet}
      </Url>

      <ProfileDetails profile={$profile.data} />
    {/if}
  </div>

  <div class="basis-1/2">
    <!-- TODO Subscription Contracts -->
    <h2>Subscription Plans</h2>
    {#if $profile.isSuccess}
      {#if addressEquals(currentAcc, $profile.data.owner)}
        <Button href={`/[network]/p/${tokenId}/newsub/`}>New Subscription Contract</Button>
      {/if}
    {/if}
    <div></div>
    <!-- TODO FIXME -->
    {#if $subscriptionContractAddresses.isPending}
      Loading ...
    {/if}
    {#if $subscriptionContractAddresses.isError}
      Failed to load {$subscriptionContractAddresses.error}
    {/if}
    {#if $subscriptionContractAddresses.isSuccess}
      <PaginatedList {pageSize} items={$subscriptionContractAddresses.data}>
        {#snippet children({ currentItems })}
          {#each currentItems as planAddr}
            <SubscriptionContractContext address={planAddr}>
              {#snippet children({ subscriptionData, erc20Data, tokenPrice, warnings })}
                {#if subscriptionData.isPending || erc20Data.isPending}
                  ... Loading ...
                {/if}
                {#if subscriptionData.isSuccess && erc20Data.isSuccess}
                  <SubscriptionContractTeaser
                    contractData={subscriptionData.data}
                    paymentTokenData={erc20Data.data}
                    {tokenPrice}
                    {warnings}
                  />
                {/if}
                {#if subscriptionData.isError || subscriptionData.isLoadingError}
                  error!
                {/if}
              {/snippet}
            </SubscriptionContractContext>
          {/each}
        {/snippet}
      </PaginatedList>
    {/if}
  </div>
</div>
