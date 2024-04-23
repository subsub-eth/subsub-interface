<script lang="ts">
  import type { PageData } from './$types';
  import { derived } from 'svelte/store';
  import { page } from '$app/stores';
  import { SubscriptionContractDetails } from '$lib/components/subscription/contract';
  import Button from '$lib/components/Button.svelte';
  import { PaginatedLoadedList } from '$lib/components/ui2/paginatedloadedlist';
  import {
    countUserSubscriptions,
    listUserSubscriptionsRev,
    type SubscriptionContractData,
    type SubscriptionContainer,
    claim
  } from '$lib/web3/contracts/subscription';
  import { SubscriptionTeaser } from '$lib/components/subscription/token';
  import ClaimControl from '$lib/components/subscription/ClaimControl.svelte';
  import { createQuery } from '@tanstack/svelte-query';
  import { currentAccount } from '$lib/web3/onboard';
  import { type Erc20Data } from '$lib/web3/contracts/erc20';
  import { isValidSigner } from '$lib/web3/contracts/erc6551';
  import { getContext } from 'svelte';
  import { queryClient, type QueryResult } from '$lib/query/config';
  import {
    ERC20_DATA_CTX,
    SUBSCRIPTION_CONTRACT_CTX,
    SUBSCRIPTION_DATA_CTX,
    SUBSCRIPTION_WARNIGNS_CTX,
    TOKEN_PRICE_CTX
  } from './+layout.svelte';
  import { erc6551Keys, subKeys } from '$lib/query/keys';
  import { type Price } from '$lib/web3/contracts/oracle';
  import type { WarningMessage } from '$lib/web3/contracts/subscription-analytics';
  import toast from '$lib/toast';
  import { log } from '$lib/logger';
  import Url from '$lib/components/Url.svelte';
  import type { BigNumberish, Hash } from '$lib/web3/contracts/common';
  import { chainEnvironment } from '$lib/chain-context';

  export let data: PageData;

  const addr = data.subscriptionAddr;
  const pageSize = 5;

  const subscriptionContract =
    getContext<QueryResult<SubscriptionContainer>>(SUBSCRIPTION_CONTRACT_CTX);

  const subscriptionData = getContext<QueryResult<SubscriptionContractData>>(SUBSCRIPTION_DATA_CTX);

  const subscriptionWarnings =
    getContext<QueryResult<Array<WarningMessage>>>(SUBSCRIPTION_WARNIGNS_CTX);

  const erc20Data = getContext<QueryResult<Erc20Data>>(ERC20_DATA_CTX);

  const tokenPrice = getContext<QueryResult<Price | null>>(TOKEN_PRICE_CTX);

  const userSubsCount = createQuery<number>(
    derived([subscriptionContract, currentAccount], ([subscriptionContract, currentAccount]) => ({
      queryKey: subKeys.balance(addr, currentAccount!),
      queryFn: async () =>
        countUserSubscriptions(subscriptionContract.data!.contract, currentAccount!),
      enabled: subscriptionContract.isSuccess && !!currentAccount
    }))
  );

  const validSigner = createQuery<boolean>(
    derived(
      [chainEnvironment, subscriptionData, currentAccount],
      ([chainEnvironment, subscriptionData, currentAccount]) => ({
        queryKey: erc6551Keys.signer(subscriptionData.data?.owner, currentAccount!),
        queryFn: async () =>
          isValidSigner(
            currentAccount!,
            subscriptionData.data!.owner,
            chainEnvironment!.ethersSigner
          ),
        enabled: subscriptionData.isSuccess && !!currentAccount
      })
    )
  );

  const invalidateSub = () => {
    log.debug('invalidating sub data', addr);
    queryClient.invalidateQueries({ queryKey: subKeys.contractUri(addr) });
  };

  const claimed = ({ detail: [amount, hash] }: CustomEvent<[BigNumberish, Hash]>) => {
    toast.info(`Funds claimed in ${hash}`);
    invalidateSub();
  };

  $: currAcc = $currentAccount!;
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
        <SubscriptionContractDetails
          contractData={$subscriptionData.data}
          paymentTokenData={$erc20Data.data}
          tokenPrice={$tokenPrice}
          warnings={$subscriptionWarnings}
        />
        {#if $validSigner.isSuccess && $validSigner.data}
          <ClaimControl
            data={$subscriptionData.data}
            claim={claim($subscriptionContract.data.contract)}
            claimTo={currAcc}
            on:claimed={claimed}
          />
        {/if}
        {#if $validSigner.isError}
          {$validSigner.error}
        {/if}
        <Url template="/[network]/s/[subscription]/edit/" let:path>
          <Button label="Edit" href={path} />
        </Url>
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
          queryKeys={subKeys.ownerList(addr, $currentAccount)}
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
