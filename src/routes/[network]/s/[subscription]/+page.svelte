<script lang="ts">
  import type { PageData } from './$types';
  import { derived as derivedStore } from 'svelte/store';
  import { SubscriptionContractDetails } from '$lib/components/subscription/contract';
  import Button from '$lib/components/Button.svelte';
  import { PaginatedLoadedList } from '$lib/components/ui2/paginatedloadedlist';
  import {
    countUserSubscriptions,
    listUserSubscriptionsRev,
    type SubscriptionContractData,
    type Subscription,
    claim,
    type WritableSubscription
  } from '$lib/web3/contracts/subscription';
  import { SubscriptionTeaser } from '$lib/components/subscription/token';
  import ClaimControl from '$lib/components/subscription/ClaimControl.svelte';
  import { createQuery } from '@tanstack/svelte-query';
  import { currentAccount, isAccountConnected } from '$lib/web3/onboard';
  import { type Erc20Data } from '$lib/web3/contracts/erc20';
  import { isValidSigner } from '$lib/web3/contracts/erc6551';
  import { getContext } from 'svelte';
  import { queryClient, type QueryResult } from '$lib/query/config';
  import {
    ERC20_DATA_CTX,
    SUBSCRIPTION_CONTRACT_CTX,
    SUBSCRIPTION_CONTRACT_OWNER_CTX,
    SUBSCRIPTION_DATA_CTX,
    SUBSCRIPTION_ERC20_BALANCE_CTX,
    SUBSCRIPTION_WARNIGNS_CTX,
    TOKEN_PRICE_CTX,
    WRITABLE_SUBSCRIPTION_CONTRACT_CTX
  } from './+layout.svelte';
  import { erc6551Keys, subKeys } from '$lib/query/keys';
  import { type Price } from '$lib/web3/contracts/oracle';
  import type { WarningMessage } from '$lib/web3/contracts/subscription-analytics';
  import toast from '$lib/toast';
  import { log } from '$lib/logger';
  import type { Address, Hash } from '$lib/web3/contracts/common';
  import { chainEnvironment } from '$lib/chain-context';
  import SubscriptionContractOwnerTeaser from '$lib/components/subscription/owner/SubscriptionContractOwnerTeaser.svelte';
  import type { ProfileData } from '$lib/web3/contracts/profile';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const addr = data.subscriptionAddr;
  const pageSize = 5;

  const subscriptionContract = getContext<QueryResult<Subscription>>(SUBSCRIPTION_CONTRACT_CTX);

  const writableSubscriptionContract = getContext<QueryResult<WritableSubscription>>(
    WRITABLE_SUBSCRIPTION_CONTRACT_CTX
  );

  const subscriptionData = getContext<QueryResult<SubscriptionContractData>>(SUBSCRIPTION_DATA_CTX);

  const subscriptionOwner = getContext<QueryResult<Address | ProfileData>>(
    SUBSCRIPTION_CONTRACT_OWNER_CTX
  );

  const subscriptionWarnings =
    getContext<QueryResult<Array<WarningMessage>>>(SUBSCRIPTION_WARNIGNS_CTX);

  const subscriptionBalance = getContext<QueryResult<bigint>>(SUBSCRIPTION_ERC20_BALANCE_CTX);

  const erc20Data = getContext<QueryResult<Erc20Data>>(ERC20_DATA_CTX);

  const tokenPrice = getContext<QueryResult<Price | null>>(TOKEN_PRICE_CTX);

  const userSubsCount = createQuery<number>(
    derivedStore(
      [subscriptionContract, currentAccount],
      ([subscriptionContract, currentAccount]) => ({
        queryKey: subKeys.balance(addr, currentAccount!),
        queryFn: async () => countUserSubscriptions(subscriptionContract.data!, currentAccount!),
        enabled: subscriptionContract.isSuccess && !!currentAccount
      })
    )
  );

  const validSigner = createQuery<boolean>(
    derivedStore(
      [chainEnvironment, subscriptionData, currentAccount],
      ([chainEnvironment, subscriptionData, currentAccount]) => ({
        queryKey: erc6551Keys.signer(subscriptionData.data?.owner, currentAccount!),
        queryFn: async () =>
          isValidSigner(
            currentAccount!,
            subscriptionData.data!.owner,
            chainEnvironment!.publicClient
          ),
        enabled: subscriptionData.isSuccess && !!currentAccount
      })
    )
  );

  const invalidateSub = () => {
    log.debug('invalidating sub data', addr);
    queryClient.invalidateQueries({ queryKey: subKeys.contractUri(addr) });
  };

  const claimed = (amount: bigint, hash: Hash) => {
    toast.info(`Funds claimed in ${hash}`);
    invalidateSub();
  };

  let currAcc = $derived($currentAccount!);
</script>

{#if $subscriptionData.isPending || $erc20Data.isPending}
  Loading contract data...
{/if}
{#if $subscriptionData.isError || $erc20Data.isError}
  Failed to load contract data
{/if}
{#if $subscriptionData.isSuccess && $subscriptionContract.isSuccess && $erc20Data.isSuccess && $subscriptionBalance.isSuccess}
  <div class="mx-auto flex max-w-(--breakpoint-2xl) flex-col">
    <!-- BEGIN profile teaser -->
    {#if $subscriptionOwner.isPending}
      Loading Subscription Owner
    {/if}
    {#if $subscriptionOwner.isError}
      Error Loading Subscription Owner
    {/if}
    {#if $subscriptionOwner.isSuccess}
      <SubscriptionContractOwnerTeaser owner={$subscriptionOwner.data} />
    {/if}
    <!-- END profile teaser -->

    <!-- BEGIN user's subscription -->
    {#if $isAccountConnected}
      <div class="grid grid-cols-1 justify-items-stretch p-6">
        <div class="mb-4 justify-self-end">
          <Button
            href={'/[network]/s/[subscription]/new'}
            disabled={$subscriptionData.data.mintingPaused}>Mint new Subscription</Button
          >
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
            queryKeys={subKeys.ownerList(addr, $currentAccount)}
            totalItems={$userSubsCount.data}
            {pageSize}
          >
            {#snippet children({ items })}
              <div class="grid grid-cols-1 gap-4">
                {#each items as item}
                  <SubscriptionTeaser
                    subscriptionData={item}
                    paymentToken={$erc20Data.data}
                    rate={BigInt($subscriptionData.data.rate)}
                  />
                {/each}
              </div>
            {/snippet}
          </PaginatedLoadedList>
        {/if}
      </div>
    {/if}
    <!-- END user's subscription -->

    <!-- BEGIN sub details -->
    <div class="p-2">
      <SubscriptionContractDetails
        contractData={$subscriptionData.data}
        paymentTokenData={$erc20Data.data}
        contractBalance={$subscriptionBalance.data}
        tokenPrice={$tokenPrice}
        warnings={$subscriptionWarnings}
      />
    </div>
    {#if $validSigner.isSuccess && $validSigner.data && $writableSubscriptionContract.isSuccess && $writableSubscriptionContract.data}
      <div class="m-6 mt-0 grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        <ClaimControl
          data={$subscriptionData.data}
          claim={claim($writableSubscriptionContract.data)}
          claimTo={currAcc}
          onClaimed={claimed}
        />
        <div>
          <Button href={'/[network]/s/[subscription]/edit/'}>Edit Contract Details</Button>
        </div>
      </div>
    {/if}
    {#if $validSigner.isError}
      {$validSigner.error}
    {/if}
    <!-- END sub details -->
  </div>
{/if}
