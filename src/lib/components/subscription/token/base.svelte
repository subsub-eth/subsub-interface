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
  import { formatUnits } from '$lib/web3/helpers';
  import { prettyNumber } from '$lib/helpers';
  import type { Erc20Data } from '$lib/web3/contracts/erc20';
  import type { BigNumberish } from '$lib/web3/contracts/common';

  /** Data of the subscription */
  export let subscriptionData: Props['subscriptionData'];

  /** rate of spending in the subscription plan, based on 18 decimals */
  export let rate: Props['rate'];

  export let paymentToken: Props['paymentToken'];

  const formatTokenAmount = (value: BigNumberish) =>
    prettyNumber(Number(formatUnits(value, paymentToken.decimals)));

  $: unspent = formatTokenAmount(subscriptionData.unspent);

  // TODO block time implementation
  $: timeLeft = Math.max(Number(subscriptionData.expiresAt) - Math.floor(Date.now() / 1000), 0);

  const asTimeUnits = (seconds: number): [number, number, number, number] => {
    const year = 60 * 60 * 24 * 365;
    const day = 60 * 60 * 24;
    const hour = 60 * 60;

    const f = Math.floor;

    const years = f(seconds / year);
    const days = f((seconds % year) / day);
    const hours = f((seconds % day) / hour);
    const minutes = f((seconds % hour) / 60);

    return [Number(years), Number(days), Number(hours), Number(minutes)];
  };

  $: timeLeftUnits = asTimeUnits(timeLeft);
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
