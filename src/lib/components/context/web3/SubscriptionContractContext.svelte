<script lang="ts">
  import type { ObservedQueryResult } from '$lib/query/config';
  import { subscriptionQueries } from '$lib/query/subscription-queries';
  import type { Address } from '$lib/web3/contracts/common';
  import { type Erc20Data } from '$lib/web3/contracts/erc20';
  import type { Price } from '$lib/web3/contracts/oracle';
  import type { SubscriptionContractData } from '$lib/web3/contracts/subscription';
  import type { WarningMessage } from '$lib/web3/contracts/subscription-analytics';
  import type { Snippet } from 'svelte';

  interface Props {
    address: Address;
    children?: Snippet<
      [
        {
          subscriptionData: ObservedQueryResult<SubscriptionContractData>;
          erc20Data: ObservedQueryResult<Erc20Data>;
          tokenPrice: ObservedQueryResult<Price | null>;
          warnings: ObservedQueryResult<Array<WarningMessage>>;
        }
      ]
    >;
  }

  let { address, children }: Props = $props();

  const { subscriptionData, erc20Data, tokenPrice, warnings } = $derived(
    subscriptionQueries(address)
  );
</script>

{@render children?.({
  subscriptionData: $subscriptionData,
  erc20Data: $erc20Data,
  tokenPrice: $tokenPrice,
  warnings: $warnings
})}
