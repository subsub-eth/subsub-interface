<script lang="ts">
  import { chainEnvironment } from '$lib/chain-context';
  import Button from '$lib/components/Button.svelte';
  import SubscriptionContractContext from '$lib/components/context/web3/SubscriptionContractContext.svelte';
  import ProfileTeaser from '$lib/components/profile/ProfileTeaser.svelte';
  import { SubscriptionContractLargeTeaser } from '$lib/components/subscription/contract';
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

  const pageSize = 6;

  let profileTotalSupply = profileTotalSupplyQuery();
  let profileContract = $derived($chainEnvironment!.profileContract);

  let subHandleTotalSupply = subscriptionHandleTotalSupplyQuery();
  let subHandleContract = $derived($chainEnvironment!.subscriptionHandleContract);
</script>

<div class="mt-8 flex flex-col items-center">
  {#if $profileTotalSupply.isError}
    Failed to load Profiles
  {/if}
  {#if $profileTotalSupply.isSuccess}
    {@const load = listAllProfilesRev(profileContract, pageSize, $profileTotalSupply.data)}
    <PaginatedLoadedList
      listClass="grid grid-cols-1 md:grid-cols-2 gap-4"
      hidePagingControls={true}
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
  <Button class="mt-4" href="/[network]/p/">More Creators</Button>
</div>

<div class="mt-8 flex flex-col items-center">
  {#if $subHandleTotalSupply.isError}
    Failed to load Subscription Plans
  {/if}
  {#if $subHandleTotalSupply.isSuccess}
    <PaginatedLoadedList
      listClass="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      hidePagingControls={true}
      load={listAllPlansRev(subHandleContract, pageSize, $subHandleTotalSupply.data)}
      queryKeys={subHandleKeys.list(subHandleContract.address)}
      totalItems={$subHandleTotalSupply.data}
      {pageSize}
    >
      {#snippet children({ items })}
        {#each items as planAddr}
          <SubscriptionContractContext address={planAddr}>
            {#snippet children({ subscriptionData, erc20Data, tokenPrice, warnings })}
              {#if subscriptionData.isPending || erc20Data.isPending}
                ... Loading ...
              {/if}
              {#if subscriptionData.isSuccess && erc20Data.isSuccess}
                <SubscriptionContractLargeTeaser
                  rootClass=""
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
  <Button class="mt-4" href="/[network]/s/">More Subscription Plans</Button>
</div>
