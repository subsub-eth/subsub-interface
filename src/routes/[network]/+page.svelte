<script lang="ts">
  import { chainEnvironment } from '$lib/chain-context';
  import SubscriptionContractContext from '$lib/components/context/web3/SubscriptionContractContext.svelte';
  import ProfileTeaser from '$lib/components/profile/ProfileTeaser.svelte';
  import { SubscriptionContractTeaser } from '$lib/components/subscription/contract';
  import { PaginatedLoadedList } from '$lib/components/ui2/paginatedloadedlist';
  import { profileKeys, subHandleKeys } from '$lib/query/keys';
  import { profileTotalSupplyQuery } from '$lib/query/profile-queries.svelte';
  import { subscriptionHandleTotalSupplyQuery } from '$lib/query/subscription-handle-queries.svelte';
  import { listAllProfilesRev } from '$lib/web3/contracts/profile';
  import { listAllPlansRev } from '$lib/web3/contracts/subscription-handle';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const pageSize = 5;

  let profileTotalSupply = profileTotalSupplyQuery();
  let profileContract = $derived($chainEnvironment!.profileContract);

  let subHandleTotalSupply = subscriptionHandleTotalSupplyQuery();
  let subHandleContract = $derived($chainEnvironment!.subscriptionHandleContract);
</script>

<h1>network: {data.network}</h1>

<div class="basis-1/2">
  <h2>Latest Creators</h2>
  {#if $profileTotalSupply.isError}
    Failed to load Profiles
  {/if}
  {#if $profileTotalSupply.isSuccess}
    {@const load = listAllProfilesRev(profileContract, pageSize, $profileTotalSupply.data)}
    <PaginatedLoadedList
      {load}
      queryKeys={profileKeys.list(profileContract.address)}
      totalItems={$profileTotalSupply.data}
      {pageSize}
    >
      {#snippet children({ items })}
        {#each items as profileData}
          <ProfileTeaser profile={profileData} />
        {/each}
      {/snippet}
    </PaginatedLoadedList>
  {/if}
</div>

<div class="basis-1/2">
  <h2>Latest Subscription Plans</h2>
  {#if $subHandleTotalSupply.isError}
    Failed to load Subscription Plans
  {/if}
  {#if $subHandleTotalSupply.isSuccess}
    <PaginatedLoadedList
      load={listAllPlansRev(subHandleContract, pageSize, $subHandleTotalSupply.data)}
      queryKeys={subHandleKeys.list(subHandleContract.address)}
      totalItems={$subHandleTotalSupply.data}
      {pageSize}
    >
      {#snippet children({ items })}
        {$subHandleTotalSupply.data}
        {#each items as planAddr}
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
    </PaginatedLoadedList>
  {/if}
</div>
