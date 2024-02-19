<script lang="ts" context="module">
  export type Props = {
    /**
     * Data of the subscription plan
     */
    contractData: SubscriptionContractData;

    /**
     * Payment token data
     */
    paymentTokenData: Erc20Data;

    /**
     * Loads price of payment token
     */
    tokenPrice: ObservedQueryResult<Price | null>;
  };
</script>

<script lang="ts">
  import {
    activeSubscriptions,
    monthlyRate,
    type SubscriptionContractData
  } from '$lib/web3/contracts/subscription';
  import type { Erc20Data } from '$lib/web3/contracts/erc20';
  import { formatEther } from 'ethers';
  import { prettyNumber } from '$lib/helpers';
  import { converted, type Price } from '$lib/web3/contracts/oracle';
  import type { ObservedQueryResult } from '$lib/query/config';

  /**
   * Data of the subscription plan
   */
  export let contractData: Props['contractData'];

  /**
   * Payment token data
   */
  export let paymentTokenData: Props['paymentTokenData'];

  /**
   *  Loads price of payment token
   */
  export let tokenPrice: Props['tokenPrice'];

  const rawRate = formatEther(monthlyRate(BigInt(contractData.rate)));
  const rate = prettyNumber(Number(rawRate));

  // for simplicity: convert active subs but max out at totalSupply
  const totalSupply = Number(contractData.totalSupply);
  const activeSubs = activeSubscriptions(BigInt(contractData.activeShares), totalSupply);

  const ratePrice = (price: Price): string => {
    return prettyNumber(converted(Number(rawRate), price));
  };
</script>

<slot {rawRate} {rate} {totalSupply} {activeSubs} {ratePrice} />
