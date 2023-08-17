<script lang="ts">
  import type { PageData } from './$types';
  import SubscriptionContractDetails from '$lib/components/subscription/SubscriptionContractDetails.svelte';
  import SubscriptionList from '$lib/components/subscription/SubscriptionList.svelte';
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import {
    countUserSubscriptions,
    listUserSubscriptionsRev
  } from '$lib/web3/contracts/subscription';
    import { CurrentAccountContext, EthersContext, SubscriptionContractContext, SubscriptionContractMetadataContext } from '$lib/components/context/web3';

  export let data: PageData;

  const addr = data.subscriptionAddr;
  const pageSize = 5;

  // TODO contract is paused
</script>

<h1>Subscription Contract Details page</h1>

Subscription Contract: {addr}

<EthersContext let:ethersSigner>
  <SubscriptionContractContext {ethersSigner} address={addr} let:subscriptionContract>
    <div class="flex flex-row space-x-4">
      <div class="basis-1/2">
        <!-- LEFT -->
        <div class="rounded-xl border-2 border-solid p-2">
          <!-- profile teaser -->
          TODO
          {#await subscriptionContract.owner()}
            Loading...
          {:then [ownerContract, ownerId]}
            Contract owner: {ownerContract} : {ownerId}
            <!-- TODO check owner contract otherwise print warning -->
          {:catch err}
            Failed to load owner {err}
          {/await}
        </div>
        <div class="rounded-xl border-2 border-solid p-2">
          <!-- sub details -->
          <SubscriptionContractMetadataContext contract={subscriptionContract} let:metadata>
            <SubscriptionContractDetails address={addr} {metadata} />
          </SubscriptionContractMetadataContext>
        </div>
      </div>

      <div class="basis-1/2">
        <!-- RIGHt -->
        <!-- mint subscription -->
        <!-- TODO Fix me -->
        <h2>My Subscrptions</h2>
        <div>
          <Button primary={true} label="Mint new Subscription" href={$page.url.pathname + 'new/'} />
        </div>
        <CurrentAccountContext let:currentAccount>
          {#await countUserSubscriptions(subscriptionContract, currentAccount)}
            Loading...
          {:then count}
            {@const pages = Math.ceil(count / pageSize)}
            {@const loadSubscriptions = listUserSubscriptionsRev(
              subscriptionContract,
              currentAccount,
              pageSize,
              count
            )}
            <SubscriptionList {pages} {loadSubscriptions} />
          {:catch err}
            error occurred {err}
          {/await}
        </CurrentAccountContext>
      </div>

      TODO Owner interface to claim funds
    </div>
  </SubscriptionContractContext>
</EthersContext>
