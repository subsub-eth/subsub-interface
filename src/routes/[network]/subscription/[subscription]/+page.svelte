<script lang="ts">
  import { requireContext } from '$lib/contexts';
  import { Subscription__factory } from '@createz/contracts/types/ethers-contracts';
  import type { PageData } from './$types';
  import { ethersSigner } from '$lib/web3/ethers';
  import SubscriptionContractDetails from '$lib/components/subscription/SubscriptionContractDetails.svelte';
  import SubscriptionList from '$lib/components/subscription/SubscriptionList.svelte';
  import { currentAccount } from '$lib/web3/onboard';

  export let data: PageData;

  const addr = data.subscriptionAddr;

  const subContract = Subscription__factory.connect(addr, $ethersSigner);
</script>

<h1>Subscription Detail page</h1>

{addr}

<div>
  <div>
    <!-- LEFT -->
    <div>
      <!-- creator teaser -->
      {#await subContract.owner()}
        Loading...
      {:then [ownerContract, ownerId]}
        {ownerContract} : {ownerId}
        <!-- TODO check owner contract otherwise print warning -->
      {:catch err}
        Failed to load owner {err}
      {/await}
    </div>
    <div>
      <!-- sub details -->
      <SubscriptionContractDetails contract={subContract} />
    </div>
  </div>

  <div>
    <!-- RIGHt -->
    <!-- mint subscription -->
    <!-- subscription list -->
    <!-- TODO Fix me -->
    <SubscriptionList contract={subContract} account={$currentAccount ?? ''} />
  </div>
</div>
