<script lang="ts">
  import type { PageData } from './$types';
  import { derived } from 'svelte/store';
  import SubscriptionContractDetails from '$lib/components/subscription/SubscriptionContractDetails.svelte';
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import { PaginatedLoadedList } from '$lib/components/ui2/paginatedloadedlist';
  import {
    claim,
    countUserSubscriptions,
    listUserSubscriptionsRev,
    pause,
    unpause,
    type SubscriptionContractData,
    type SubscriptionContainer
  } from '$lib/web3/contracts/subscription';
  import SubscriptionTeaser from '$lib/components/subscription/SubscriptionTeaser.svelte';
  import SubscriptionContractControl from '$lib/components/subscription/SubscriptionContractControl.svelte';
  import { aflow } from '$lib/helpers';
  import { createQuery } from '@tanstack/svelte-query';
  import { currentAccount } from '$lib/web3/onboard';
  import { type Erc20Data } from '$lib/web3/contracts/erc20';
  import { getContext } from 'svelte';
  import type { QueryResult } from '$lib/query/config';
  import {
    ERC20_DATA_CTX,
    SUBSCRIPTION_CONTRACT_CTX,
    SUBSCRIPTION_DATA_CTX
  } from './+layout.svelte';
  import { BALANCE, SUBSCRIPTION } from '$lib/query/keys';

  export let data: PageData;

  const addr = data.subscriptionAddr;
  const pageSize = 5;

  const subscriptionContract =
    getContext<QueryResult<SubscriptionContainer>>(SUBSCRIPTION_CONTRACT_CTX);

  const subscriptionData = getContext<QueryResult<SubscriptionContractData>>(SUBSCRIPTION_DATA_CTX);

  const erc20Data = getContext<QueryResult<Erc20Data>>(ERC20_DATA_CTX);

  const userSubsCount = createQuery<number>(
    derived([subscriptionContract, currentAccount], ([subscriptionContract, currentAccount]) => ({
      queryKey: [SUBSCRIPTION, addr, currentAccount, BALANCE],
      queryFn: async () =>
        countUserSubscriptions(subscriptionContract.data!.contract, currentAccount!),
      enabled: subscriptionContract.isSuccess && !!currentAccount
    }))
  );

  const update = async () => {};
</script>

<h1>Subscription Contract Details page</h1>

Subscription Contract: {addr}

{#if $subscriptionData.isPending || $erc20Data.isPending}
  Loading contract data...
{/if}
{#if $subscriptionData.isError || $erc20Data.isError}
  Failed to load contract data
{/if}
{#if $subscriptionData.isSuccess && $subscriptionContract.isSuccess && $erc20Data.isSuccess}
  <div class="flex flex-row space-x-4">
    <div class="basis-1/2">
      <!-- LEFT -->
      <div class="rounded-xl border-2 border-solid p-2">
        <!-- profile teaser -->
        owner: {$subscriptionData.data.owner}
      </div>
      <div class="rounded-xl border-2 border-solid p-2">
        <!-- sub details -->
        <SubscriptionContractDetails address={addr} metadata={$subscriptionData.data} />
        <SubscriptionContractControl
          metadata={$subscriptionData.data}
          pause={aflow(pause($subscriptionContract.data), update)}
          unpause={aflow(unpause($subscriptionContract.data), update)}
          claim={aflow(claim($subscriptionContract.data), update)}
        />
      </div>
    </div>

    <div class="basis-1/2">
      <!-- RIGHt -->
      <!-- mint subscription -->
      <!-- TODO Fix me -->
      <h2>My Subscrptions</h2>
      <div>
        <Button
          primary={true}
          label="Mint new Subscription"
          href={$page.url.pathname + 'new/'}
          isDisabled={$subscriptionData.data.mintingPaused}
        />
      </div>
      {#if $userSubsCount.isPending}
        Loading...
      {/if}
      {#if $userSubsCount.isError}
        Failed to load subscriptions
      {/if}
      {#if $userSubsCount.isSuccess && $currentAccount}
        {@const load = listUserSubscriptionsRev(
          $subscriptionContract.data.contract,
          $currentAccount,
          pageSize,
          $userSubsCount.data
        )}
        <PaginatedLoadedList
          {load}
          queryKeys={['subs', addr, $currentAccount]}
          totalItems={$userSubsCount.data}
          {pageSize}
          let:items
        >
          {#each items as item}
            <SubscriptionTeaser
              subscriptionData={item}
              paymentToken={$erc20Data.data}
              rate={BigInt($subscriptionData.data.rate)}
            />
          {/each}
        </PaginatedLoadedList>
      {/if}
    </div>
  </div>
{/if}
