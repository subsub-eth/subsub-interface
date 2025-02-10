<script lang="ts" module>
  export interface Props extends BaseProps {
    /** Loads the USD price of the payment token */
    tokenPrice: ObservedQueryResult<Price | null>;
    /** open the technical details collapsible */
    technicalsOpen?: boolean;
  }
</script>

<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Coins, Droplet, ExternalLink, Gem, Hourglass, Percent, PiggyBank } from 'lucide-svelte';
  import TrafficLight from '$lib/components/TrafficLight.svelte';
  import PropertyBox from '$lib/components/ui/PropertyBox.svelte';
  import TokenLogo from '$lib/components/TokenLogo.svelte';
  import CollapsibleBox from '$lib/components/ui/CollapsibleBox.svelte';
  import DetailsProperty from '$lib/components/ui/DetailsProperty.svelte';
  import { type BaseProps, baseValues } from './base';
  import { MULTIPLIER_BASE, monthlyRate } from '$lib/web3/contracts/subscription';
  import type { ObservedQueryResult } from '$lib/query/config';
  import { convertedPretty, type Price } from '$lib/web3/contracts/oracle';
  import { prettyNumber } from '$lib/helpers';
  import { formatEther, formatUnits } from '$lib/web3/helpers';
  import type { BigNumberish } from '$lib/web3/contracts/common';
  import { accountUrl, nftUrl } from '$lib/blockexplorer-url.svelte';

  let {
    subscriptionData,
    rate,
    paymentToken,
    tokenPrice,
    technicalsOpen = false
  }: Props = $props();

  let { timeLeftUnits, unspent, formatTokenAmount } = $derived(
    baseValues({ subscriptionData, paymentToken })
  );

  let multiplier = $derived(subscriptionData.multiplier);
  let multiplierActive = $derived(multiplier > MULTIPLIER_BASE);

  let rawRate = $derived(Number(formatEther(monthlyRate(BigInt(rate)))));
  let defaultRate = $derived(prettyNumber(rawRate));

  let multipliedRawRate = $derived(rawRate * (multiplier / 100));
  let multipliedRate = $derived(prettyNumber(multipliedRawRate));

  let lockedAmount = $derived(
    BigInt(subscriptionData.unspent) - BigInt(subscriptionData.withdrawable)
  );

  let tokenValueAsUsd = $derived((value: bigint, price: Price | null) => {
    if (!price) {
      return undefined;
    }
    return convertedPretty(Number(formatUnits(value, paymentToken.decimals)), price);
  });

  let usdPrice = $derived((value: BigNumberish): string | undefined => {
    if (tokenPrice.isSuccess) {
      const usdValue = tokenValueAsUsd(BigInt(value), tokenPrice.data);
      if (usdValue) {
        return '$' + usdValue;
      }
    }

    return undefined;
  });

  let rateUsd = $derived((rate: number): string | undefined =>
    tokenPrice.isSuccess && tokenPrice.data ? convertedPretty(rate, tokenPrice.data) : undefined
  );

  const timeUnitsWithNames = (timeUnits: [number, number, number, number]) => {
    const names = ['y', 'd', 'h', 'm'];
    return timeUnits.map((u, i): [number, string] => [u, names[i]]).filter(([u]) => u > 0);
  };

  let timeUnits = $derived(timeUnitsWithNames(timeLeftUnits));
</script>

<div class="text-foreground p-4">
  <!-- header -->
  <div class="flex items-center gap-4 pt-2">
    <TrafficLight status={subscriptionData.isActive ? 'green' : 'red'} />
    <div>
      <h2>{subscriptionData.name}</h2>
      <p class="text-muted-foreground">{subscriptionData.description}</p>
    </div>
  </div>

  <!-- Main Properties -->
  <div class="grid gap-4 pt-4 sm:grid-cols-2 md:grid-cols-4">
    <PropertyBox
      title="Remaining"
      TitleIcon={Hourglass}
      value={!subscriptionData.isActive
        ? 'expired'
        : timeUnits.length === 0
          ? 'a few seconds'
          : timeUnits
              .slice(0, 2)
              .map(([u, n]) => `${u}${n}`)
              .join(' ')}
    />

    <PropertyBox
      title="Remaining funds"
      TitleIcon={Coins}
      subValue={usdPrice(subscriptionData.unspent)}
    >
      {#snippet value()}
        <div class="text-sm leading-none font-medium">
          <span class="text-2xl font-bold">{unspent}</span>
          {paymentToken.symbol}
        </div>
      {/snippet}
    </PropertyBox>
    <PropertyBox
      title="Total deposited"
      TitleIcon={Gem}
      subValue={usdPrice(subscriptionData.deposited)}
    >
      {#snippet value()}
        <div class="text-sm leading-none font-medium">
          <span class="text-2xl font-bold">{formatTokenAmount(subscriptionData.deposited)}</span>
          {paymentToken.symbol}
        </div>
      {/snippet}
    </PropertyBox>
    <PropertyBox
      title="Total tipped"
      TitleIcon={PiggyBank}
      subValue={usdPrice(subscriptionData.tips)}
    >
      {#snippet value()}
        <div class="text-sm leading-none font-medium">
          <span class="text-2xl font-bold">{formatTokenAmount(subscriptionData.tips)}</span>
          {paymentToken.symbol}
        </div>
      {/snippet}
    </PropertyBox>
  </div>

  <!-- rate + multiplier, withdrawable, paused, token logo, subcontract name -->
  <div class="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
    <PropertyBox rootClass="border-0" title="Rate" TitleIcon={Percent}>
      {#snippet value()}
        <div class="flex items-center gap-4 pt-2">
          <TokenLogo
            class="h-12 w-12 basis-1/7"
            address={paymentToken.address}
            fallbackSymbol={paymentToken.symbol}
          />
          <div>
            {#if multiplierActive}
              <h4>Default</h4>
            {/if}
            <p class="text-sm leading-none font-medium">
              <span class="text-xl font-bold">{defaultRate}</span>
              {paymentToken.symbol} / month
            </p>
            {#if tokenPrice.data}
              <p class="text-muted-foreground text-xs">${rateUsd(rawRate)} / month</p>
            {/if}
          </div>
          {#if multiplierActive}
            <div>
              <h4>Multiplier {multiplier / 100}x</h4>
              <div>
                <p class="text-sm leading-none font-medium">
                  <span class="text-xl font-bold">{multipliedRate}</span>
                  {paymentToken.symbol} / month
                </p>
                {#if tokenPrice.data}
                  <p class="text-muted-foreground text-xs">
                    ${rateUsd(multipliedRawRate)} / month
                  </p>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      {/snippet}
    </PropertyBox>
    <PropertyBox rootClass="border-0" title="Liquid funds" TitleIcon={Droplet}>
      {#snippet value()}
        <div class="flex items-center gap-4 pt-2">
          <div class="basis-1/2">
            <h4>Withdrawable</h4>
            <p>
              <span class="text-2xl font-bold"
                >{formatTokenAmount(subscriptionData.withdrawable)}</span
              >
              {paymentToken.symbol}
            </p>
            {#if tokenPrice.data}
              <p class="text-muted-foreground text-xs">
                {usdPrice(subscriptionData.withdrawable)}
              </p>
            {/if}
          </div>
          <div class="basis-1/2 pl-6">
            <h4>Locked</h4>
            <p>
              <span class="text-2xl font-bold">{formatTokenAmount(lockedAmount)}</span>
              {paymentToken.symbol}
            </p>
            {#if tokenPrice.data}
              <p class="text-muted-foreground text-xs">
                {usdPrice(lockedAmount)}
              </p>
            {/if}
          </div>
        </div>
      {/snippet}
    </PropertyBox>
  </div>

  <!-- technicals -->
  <CollapsibleBox rootClass="mt-4" title="Technical Details" open={technicalsOpen}>
    <DetailsProperty title="Address" help="The address of this contract">
      {#snippet value()}
        <div class="flex items-center gap-2">
          <div>
            {subscriptionData.address}
          </div>
          <Button
            variant="link"
            target="_blank"
            href={accountUrl(subscriptionData.address)}
            class="h-0 px-0 py-0"
          >
            <ExternalLink class="size-4" />
          </Button>
        </div>
      {/snippet}
    </DetailsProperty>
    <DetailsProperty title="Token Id" help="Id of the token">
      {#snippet value()}
        <div class="flex items-center gap-2">
          <div>
            {subscriptionData.tokenId}
          </div>
          <Button
            variant="link"
            target="_blank"
            href={nftUrl(subscriptionData.address, BigInt(subscriptionData.tokenId))}
            class="h-0 px-0 py-0"
          >
            <ExternalLink class="size-4" />
          </Button>
        </div>
      {/snippet}
    </DetailsProperty>
    <DetailsProperty
      title="Deposited"
      value={BigInt(subscriptionData.deposited).toString()}
      help="Amount of tokens ever deposited"
    />
    <DetailsProperty
      title="Spent"
      value={BigInt(subscriptionData.spent).toString()}
      help="Amount of tokens spent on the subscription"
    />
    <DetailsProperty
      title="Unspent"
      value={BigInt(subscriptionData.unspent).toString()}
      help="Amount of tokens deposited but not yet spent"
    />
    <DetailsProperty
      title="Withdrawable"
      value={BigInt(subscriptionData.withdrawable).toString()}
      help="Amount of unspent tokens that can be withdrawn"
    />
    <DetailsProperty
      title="Locked"
      value={lockedAmount.toString()}
      help="Amount of locked tokens that cannot be withdrawn"
    />
    <DetailsProperty
      title="Tips"
      value={BigInt(subscriptionData.tips).toString()}
      help="Amount of tokens tipped on this subscription"
    />
    <DetailsProperty
      title="Multiplier"
      value={BigInt(subscriptionData.multiplier).toString()}
      help="Multiplier applied to the rate of this subscription"
    />
    <DetailsProperty
      title="Expires at"
      value={BigInt(subscriptionData.expiresAt).toString()}
      help="Time unit subscriptions expires or is expired at"
    />
  </CollapsibleBox>
</div>
