<script lang="ts" context="module">
  export type Props = {
    /** Data of the subscription */
    subscriptionData: SubscriptionData;

    /** rate of spending in the subscription plan, based on 18 decimals */
    rate: BigNumberish;

    /** Underlying payment token of the subscription plan */
    paymentToken: Erc20Data;
  };
</script>

<script lang="ts">
  import type { SubscriptionData } from '$lib/web3/contracts/subscription';
  import { formatUnits } from 'ethers';
  import { convertDecimals, prettyNumber } from '$lib/helpers';
  import type { Erc20Data } from '$lib/web3/contracts/erc20';
  import type { BigNumberish } from '$lib/web3/contracts/common';

  /** Data of the subscription */
  export let subscriptionData: Props['subscriptionData'];

  /** rate of spending in the subscription plan, based on 18 decimals */
  export let rate: Props['rate'];

  export let paymentToken: Props['paymentToken'];

  const formatTokenAmount = (value: BigNumberish) =>
    prettyNumber(Number(formatUnits(value, paymentToken.decimals)));

  const unspent = formatTokenAmount(subscriptionData.unspent);

  // TODO block time implementation
  const timeLeft =
    convertDecimals(BigInt(subscriptionData.unspent), paymentToken.decimals, 18) /
    ((BigInt(rate) * BigInt(subscriptionData.multiplier)) / 100n);

  const asTimeUnits = (seconds: bigint): [number, number, number, number] => {
      const year = BigInt(60 * 60 * 24 * 365);
      const day = BigInt(60 * 60 * 24);
      const hour = BigInt(60 * 60);

      const years = seconds / year;
      const days = (seconds % year) / day;
      const hours = (seconds % day) / hour;
      const minutes = (seconds % hour) / 60n;

      return [Number(years), Number(days), Number(hours), Number(minutes)];
    };
  const timeLeftUnits: [number, number, number, number] = asTimeUnits(timeLeft);
</script>

<slot
  {subscriptionData}
  {rate}
  {paymentToken}
  {unspent}
  {formatTokenAmount}
  {timeLeft}
  {timeLeftUnits}
/>
