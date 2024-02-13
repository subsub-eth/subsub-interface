<script lang="ts">
  import type { PageData } from './$types';
  import SubscriptionContractTeaser from '$lib/components/subscription/SubscriptionContractTeaser.svelte';
  import { addressEquals } from '$lib/web3/helpers';
  import ProfileDetails from '$lib/components/profile/ProfileDetails.svelte';
  import Button from '$lib/components/Button.svelte';
  import { getSubscriptionContractAddresses } from '$lib/web3/contracts/subscription-handle';
  import { listSubscriptionContracts } from '$lib/web3/contracts/subscription';
  import { chainEnvironment } from '$lib/chain-context';
  import { currentAccount } from '$lib/web3/onboard';
  import { createQuery } from '@tanstack/svelte-query';
  import { derived } from 'svelte/store';
  import type { Address } from '$lib/web3/contracts/common';
  import { findProfile } from '$lib/web3/contracts/profile';
  import Url from '$lib/components/Url.svelte';
  import { PaginatedLoadedList } from '$lib/components/ui2/paginatedloadedlist';
  import type { ProfileData } from '$lib/web3/contracts/profile';
  import { log } from '$lib/logger';
  import { getErc20Contract, getErc20Data, type Erc20Data } from '$lib/web3/contracts/erc20';
  import { findPrice, type Price } from '$lib/web3/contracts/oracle';
  import { findDefaultProfileErc6551Account } from '$lib/web3/contracts/erc6551';
  import { erc6551Keys, profileKeys, subHandleKeys } from '$lib/query/keys';

  export let data: PageData;

  const tokenId = data.profile;

  const pageSize = 5;

  $: ethersSigner = $chainEnvironment!.ethersSigner;
  $: currentAcc = $currentAccount!;
  $: subHandleAddr = $chainEnvironment!.chainData.contracts.subscriptionHandle;

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

  $: loadErc20Data = async (address: Address): Promise<Erc20Data> => {
    const { contract } = getErc20Contract(address, $chainEnvironment!.ethersSigner);
    return getErc20Data(contract);
  };

  $: loadPrice = async (address: Address): Promise<Price | undefined> => {
    return findPrice(
      address,
      $chainEnvironment!.chainData.contracts.priceFeeds,
      $chainEnvironment!.ethersSigner
    );
  };
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
      {@const load = listSubscriptionContracts(
        ethersSigner,
        $subscriptionContractAddresses.data,
        pageSize
      )}

      <PaginatedLoadedList
        {load}
        queryKeys={subHandleKeys.ownerList(subHandleAddr, currentAcc)}
        let:items
        totalItems={$subscriptionContractAddresses.data.length}
        {pageSize}
      >
        {#each items as plan}
          <SubscriptionContractTeaser
            contractData={plan}
            getErc20Data={loadErc20Data}
            getPriceData={loadPrice}
          />
        {/each}
      </PaginatedLoadedList>
    {/if}
  </div>
</div>
