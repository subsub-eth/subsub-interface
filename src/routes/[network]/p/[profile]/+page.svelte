<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import SubscriptionContractTeaser from '$lib/components/subscription/SubscriptionContractTeaser.svelte';
  import { addressEquals } from '$lib/web3/helpers';
  import ProfileDetails from '$lib/components/profile/ProfileDetails.svelte';
  import Button from '$lib/components/Button.svelte';
  import ProfileMetadataContext from '$lib/components/context/web3/ProfileMetadataContext.svelte';
  import { getSubscriptionContractAddresses } from '$lib/web3/contracts/subscription-handle';
  import { listSubscriptionContracts } from '$lib/web3/contracts/subscription';
  import { chainEnvironment } from '$lib/chain-context';
  import { currentAccount } from '$lib/web3/onboard';
  import { findDefaultProfileErc6551Account } from '$lib/web3/contracts/erc6551';
  import { createQuery } from '@tanstack/svelte-query';
  import { derived } from 'svelte/store';
  import type { Address } from '$lib/web3/contracts/common';
  import { PaginatedLoadedList } from '$lib/components/ui2/paginatedloadedlist';

  export let data: PageData;

  const tokenId = data.profile;

  const pageSize = 5;

  $: ethersSigner = $chainEnvironment!.ethersSigner;
  $: profileContract = $chainEnvironment!.profileContract;
  $: currentAcc = $currentAccount!;

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
</script>

<h1>Profile Details</h1>

<div class="flex flex-row space-x-4">
  <div class="basis-1/2">
    <ProfileMetadataContext {tokenId} contract={profileContract} let:metadata>
      <h2>Profile</h2>
      <ProfileDetails id={tokenId} {metadata} />
    </ProfileMetadataContext>
  </div>

  <div class="basis-1/2">
    <!-- TODO Subscription Contracts -->
    <h2>Subscription Contracts</h2>
    {#await profileContract.ownerOf(tokenId)}
      Loading...
    {:then owner}
      {#if addressEquals(currentAcc, owner)}
        <Button
          primary={true}
          label="New Subscription Contract"
          href={`${$page.url.pathname}newsub/`}
        />
      {/if}
    {/await}
    <div />
    <!-- TODO FIXME -->
    {#if $subscriptionContractAddresses.isPending }
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
        {#each items as [address, metadata]}
          <SubscriptionContractTeaser {address} {metadata} />
        {/each}
      </PaginatedLoadedList>
    {/if}
  </div>
</div>
