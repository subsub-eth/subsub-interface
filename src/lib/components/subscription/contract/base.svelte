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
     *  Function to load price data for the underlying erc20 token from
     */
    getPriceData: (address: Address) => Promise<Price | undefined>;
  };
</script>

<script lang="ts">
  import {
    activeSubscriptions,
    monthlyRate,
    type SubscriptionContractData
  } from '$lib/web3/contracts/subscription';
  import type { Erc20Data } from '$lib/web3/contracts/erc20';
  import type { Address } from '$lib/web3/contracts/common';
  import { createQuery } from '@tanstack/svelte-query';
  import { formatEther } from 'ethers';
  import { prettyNumber } from '$lib/helpers';
  import { converted, type Price } from '$lib/web3/contracts/oracle';
  import { erc20Keys } from '$lib/query/keys';

  /**
   * Data of the subscription plan
   */
  export let contractData: SubscriptionContractData;

  /**
   * Payment token data
   */
  export let paymentTokenData: Erc20Data;

  /**
   *  Function to load price data for the underlying erc20 token from
   */
  export let getPriceData: (address: Address) => Promise<Price | undefined>;

  const price = createQuery<Price | false>({
    queryKey: erc20Keys.price(paymentTokenData.address),
    queryFn: async () => {
      return (await getPriceData(paymentTokenData.address)) ?? false;
    }
  });

  const rawRate = formatEther(monthlyRate(BigInt(contractData.rate)));
  const rate = prettyNumber(Number(rawRate));

  // for simplicity: convert active subs but max out at totalSupply
  const totalSupply = Number(contractData.totalSupply);
  const activeSubs = activeSubscriptions(BigInt(contractData.activeShares), totalSupply);

  const ratePrice = (price: Price): string => {
    return prettyNumber(converted(Number(rawRate), price));
  };
</script>

<slot price={$price} {rawRate} {rate} {totalSupply} {activeSubs} {ratePrice} />
