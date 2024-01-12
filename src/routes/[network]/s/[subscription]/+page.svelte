<script lang="ts">
  import type { PageData } from './$types';
  import SubscriptionContractDetails from '$lib/components/subscription/SubscriptionContractDetails.svelte';
  import SubscriptionList from '$lib/components/subscription/SubscriptionList.svelte';
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import {
    claim,
    countUserSubscriptions,
    createSubscriptionContract,
    listUserSubscriptionsRev,
    pause,
    unpause,
    type SubscriptionContractMetadata,
    contractMetadata,

    type SubscriptionContractData

  } from '$lib/web3/contracts/subscription';
  import SubscriptionContractControl from '$lib/components/subscription/SubscriptionContractControl.svelte';
  import { aflow } from '$lib/helpers';
  import { chainEnvironment } from '$lib/chain-context';
  import { currentAccount } from '$lib/web3/onboard';
  import { createQuery } from '@tanstack/svelte-query';
  import SubscriptionTeaser from '$lib/components/subscription/SubscriptionTeaser.svelte';

  export let data: PageData;

  const addr = data.subscriptionAddr;
  const pageSize = 5;

  $: ethersSigner = $chainEnvironment!.ethersSigner;
  $: currentAcc = $currentAccount!;
  $: subscriptionContract = createSubscriptionContract(addr, ethersSigner);

  const owner = createQuery<string>({
    queryKey: ['subContractOwner', addr],
    queryFn: async () => {
      console.log('query for owner', addr, subscriptionContract);
      return await subscriptionContract.owner();
    }
  });
  const metadata = createQuery<SubscriptionContractData>({
    queryKey: ['subContractMetadata', addr, currentAcc],
    queryFn: async () => {
      console.log('query for sub contract metadata', addr, subscriptionContract);
      const data = await contractMetadata(subscriptionContract);
      console.log('sub contract metadata', data);
      return data;
    }
  });

  const update = async () => {};
</script>

<h1>Subscription Contract Details page</h1>

Subscription Contract: {addr}

{#if $metadata.isPending}
  Loading contract data...
{/if}
{#if $metadata.isError}
  Failed to load contract data
{/if}
{#if $metadata.isSuccess}
  <div class="flex flex-row space-x-4">
    <div class="basis-1/2">
      <!-- LEFT -->
      <div class="rounded-xl border-2 border-solid p-2">
        <!-- profile teaser -->
        TODO
        {#if $owner.isPending}
          Loading...
        {/if}
        {#if $owner.isError}
          Failed to load owner
        {/if}
        {#if $owner.isSuccess}
          owner: {$owner.data}
        {/if}
      </div>
      <div class="rounded-xl border-2 border-solid p-2">
        <!-- sub details -->
        <SubscriptionContractDetails address={addr} metadata={$metadata.data} />
        <SubscriptionContractControl
          metadata={$metadata.data}
          pause={aflow(pause(subscriptionContract), update)}
          unpause={aflow(unpause(subscriptionContract), update)}
          claim={aflow(claim(subscriptionContract), update)}
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
          isDisabled={$metadata.data.paused}
        />
      </div>
      {#await countUserSubscriptions(subscriptionContract, currentAcc)}
        Loading...
      {:then count}
        {@const pages = Math.ceil(count / pageSize)}
        {@const loadSubscriptions = listUserSubscriptionsRev(
          subscriptionContract,
          currentAcc,
          pageSize,
          count
        )}
        <SubscriptionList {pages} {loadSubscriptions} />
      {:catch err}
        error occurred {err}
      {/await}
    </div>
  </div>
{/if}
