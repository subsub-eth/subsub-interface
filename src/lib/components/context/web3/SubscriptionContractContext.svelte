<script lang="ts">
  import { subscriptionQueries } from '$lib/query/subscription-queries';
  import type { Address } from '$lib/web3/contracts/common';

  export let address: Address;

  const { subscriptionData, erc20Data, tokenPrice } = subscriptionQueries(address);
</script>

<slot subscriptionData={$subscriptionData} erc20Data={$erc20Data} tokenPrice={$tokenPrice} />
