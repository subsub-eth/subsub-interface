<script lang="ts" context="module">
  export type Props = {
    /** Data of the subscription */
    subscriptionData: SubscriptionData;

    /** rate of spending in the subscription plan, based on 18 decimals */
    rate: BigNumberish;

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

  const unspent = prettyNumber(
    Number(formatUnits(subscriptionData.unspent, paymentToken.decimals))
  );

  // TODO block time implementation
  const timeLeft =
    convertDecimals(BigInt(subscriptionData.unspent), paymentToken.decimals, 18) / BigInt(rate);
  const timeLeftDays = timeLeft / 60n / 60n / 24n;
</script>

<slot {subscriptionData} {rate} {paymentToken} {unspent} {timeLeft} {timeLeftDays} />
