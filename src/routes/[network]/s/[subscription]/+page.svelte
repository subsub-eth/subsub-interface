<script lang="ts">
  import type { PageData } from './$types';
  import SubscriptionContractDetails from '$lib/components/subscription/SubscriptionContractDetails.svelte';
  import SubscriptionList from '$lib/components/subscription/SubscriptionList.svelte';
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import {
    countUserSubscriptions,
    listUserSubscriptionsRev,
    pause,
    unpause
  } from '$lib/web3/contracts/subscription';
  import {
    CurrentAccountContext,
    EthersContext,
    SubscriptionContractContext,
    SubscriptionContractMetadataContext
  } from '$lib/components/context/web3';
  import SubscriptionContractControl from '$lib/components/subscription/SubscriptionContractControl.svelte';

  export let data: PageData;

  const addr = data.subscriptionAddr;
  const pageSize = 5;
</script>

<h1>Subscription Contract Details page</h1>

Subscription Contract: {addr}

<EthersContext let:ethersSigner>
  <SubscriptionContractContext {ethersSigner} address={addr} let:subscriptionContract>
    <CurrentAccountContext let:currentAccount>
      <SubscriptionContractMetadataContext contract={subscriptionContract} let:metadata let:update>
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
              <SubscriptionContractDetails address={addr} {metadata} />
              <SubscriptionContractControl
                {metadata}
                pause={pause(subscriptionContract)}
                unpause={unpause(subscriptionContract)}
                on:paused={() => update()}
                on:unpaused={() => update()}
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
                isDisabled={metadata.paused}
              />
            </div>
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
          </div>
        </div>
      </SubscriptionContractMetadataContext>
    </CurrentAccountContext>
  </SubscriptionContractContext>
</EthersContext>
