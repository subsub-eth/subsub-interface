<script lang="ts">
  import SubscriptionTeaser from '$lib/components/subscription/SubscriptionTeaser.svelte';
  import type { PageData } from './$types';
  import SubscriptionDeposit from '$lib/components/subscription/action/SubscriptionDeposit.svelte';
  import SubscriptionWithdrawal from '$lib/components/subscription/action/SubscriptionWithdrawal.svelte';
  import EthersContext from '$lib/components/util/EthersContext.svelte';
  import SubscriptionContractContext from '$lib/components/util/SubscriptionContractContext.svelte';
  import CurrentAccountContext from '$lib/components/util/CurrentAccountContext.svelte';

  export let data: PageData;

  const addr = data.subscriptionAddr;
  const tokenId = data.tokenId;
</script>

<h1>Subscription Details</h1>

<EthersContext let:ethersSigner>
  <SubscriptionContractContext {ethersSigner} address={addr} let:subscriptionContract>
    <div>
      <div>
        <!-- LEFT -->
        <!-- TODO proper details -->
        <SubscriptionTeaser contract={subscriptionContract} {tokenId} />
        <!-- Subscription token details -->
        <!-- sub contract details -->
        <!-- Contract owner teaser -->
      </div>

      <div>
        <!-- RIGHT -->

        <!-- subscription controls -->
        <!-- deposit(renew) / tip -->
        <!-- withdraw / cancel -->
        <CurrentAccountContext let:currentAccount>
          <SubscriptionDeposit
            subContract={subscriptionContract}
            {currentAccount}
            subscriptionId={tokenId}
          />
          <SubscriptionWithdrawal subContract={subscriptionContract} subscriptionId={tokenId} />
        </CurrentAccountContext>
      </div>
    </div>
  </SubscriptionContractContext>
</EthersContext>
