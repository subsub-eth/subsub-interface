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
    createSubscriptionContract,
    listUserSubscriptionsRev,
    pause,
    unpause,
    getContractData,
    type SubscriptionContractData
  } from '$lib/web3/contracts/subscription';
  import SubscriptionTeaser from '$lib/components/subscription/SubscriptionTeaser.svelte';
  import SubscriptionContractControl from '$lib/components/subscription/SubscriptionContractControl.svelte';
  import { aflow } from '$lib/helpers';
  import { chainEnvironment } from '$lib/chain-context';
  import { createQuery } from '@tanstack/svelte-query';
  import { type Subscription } from '@createz/contracts/types/ethers-contracts';
  import { log } from '$lib/logger';
  import { currentAccount } from '$lib/web3/onboard';
  import { type Erc20Data, getErc20Contract, getErc20Data } from '$lib/web3/contracts/erc20';

  export let data: PageData;

  const addr = data.subscriptionAddr;
  const pageSize = 5;

  const subscriptionContract = createQuery<Subscription>(
    derived(chainEnvironment, (chainEnvironment) => ({
      queryKey: ['subscription', addr],
      queryFn: () => createSubscriptionContract(addr, chainEnvironment!.ethersSigner)
    }))
  );

  const subscriptionData = createQuery<SubscriptionContractData>(
    derived(subscriptionContract, (subscriptionContract) => ({
      queryKey: ['subContractMetadata', addr],
      queryFn: async () => {
        log.debug('query for sub contract metadata', addr, subscriptionContract);
        const data = await getContractData(subscriptionContract.data!);
        log.debug('sub contract metadata', data);
        return data;
      },
      enabled: subscriptionContract.isSuccess
    }))
  );

  const userSubsCount = createQuery<number>(
    derived([subscriptionContract, currentAccount], ([subscriptionContract, currentAccount]) => ({
      queryKey: ['userSubsCount', addr, currentAccount],
      queryFn: async () => countUserSubscriptions(subscriptionContract.data!, currentAccount!),
      enabled: subscriptionContract.isSuccess && !!currentAccount
    }))
  );

  const erc20Data = createQuery<Erc20Data>(
    derived([subscriptionData, chainEnvironment], ([subscriptionData, chainEnvironment]) => ({
      queryKey: ['erc20', subscriptionData.data?.token],
      queryFn: async () => {
        const contract = getErc20Contract(
          subscriptionData.data!.token,
          chainEnvironment!.ethersSigner
        );
        return getErc20Data(contract);
      },
      enabled: subscriptionData.isSuccess
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
          $subscriptionContract.data,
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
