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
  import { findDefaultProfileErc6551Account } from '$lib/web3/contracts/erc6551';
  import { createQuery } from '@tanstack/svelte-query';
  import { derived } from 'svelte/store';
  import type { Address } from '$lib/web3/contracts/common';
  import { findProfile } from '$lib/web3/contracts/profile';
  import Url from '$lib/components/Url.svelte';
  import { PaginatedLoadedList } from '$lib/components/ui2/paginatedloadedlist';
  import type { ProfileData } from '$lib/web3/contracts/profile';
  import { log } from '$lib/logger';
  import { erc20Contract, erc20Data, type Erc20Data } from '$lib/web3/contracts/erc20';

  export let data: PageData;

  const tokenId = data.profile;

  const pageSize = 5;

  $: ethersSigner = $chainEnvironment!.ethersSigner;
  $: currentAcc = $currentAccount!;

  const profile = createQuery<ProfileData>(
    derived(chainEnvironment, (chainEnvironment) => ({
      queryKey: ['profile', tokenId.toString()],
      queryFn: async () => {
        log.debug('find profile', chainEnvironment);
        const profile = await findProfile(chainEnvironment!.profileContract, tokenId);
        return profile!;
      }
    }))
  );

  const ownerAccount = createQuery<Address>(
    derived(chainEnvironment, (chainEnvironment) => ({
      queryKey: ['profileAccount', tokenId.toString()],
      queryFn: async () => {
        const acc = await findDefaultProfileErc6551Account(chainEnvironment!, tokenId);
        return acc!;
      }
    }))
  );

  const subscriptionContractAddresses = createQuery<Array<Address>>(
    derived([chainEnvironment, ownerAccount], ([chainEnvironment, ownerAccount]) => ({
      queryKey: ['subContractAddresses', ownerAccount],
      queryFn: async () =>
        await getSubscriptionContractAddresses(
          chainEnvironment!.subscriptionHandleContract,
          ownerAccount.data!
        ),
      enabled: ownerAccount.isFetched && !!ownerAccount.data
    }))
  );

  $: loadErc20Data = async (address: Address): Promise<Erc20Data> => {
    const contract = erc20Contract(address, $chainEnvironment!.ethersSigner);
    return erc20Data(contract);
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
        queryKey="profiles"
        let:items
        totalItems={$subscriptionContractAddresses.data.length}
        {pageSize}
      >
        {#each items as plan}
          <SubscriptionContractTeaser contractData={plan} getErc20Data={loadErc20Data} />
        {/each}
      </PaginatedLoadedList>
    {/if}
  </div>
</div>
