<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Coins, Droplet, ExternalLink, Gem, Hourglass, Percent, PiggyBank } from 'lucide-svelte';
  import TrafficLight from '$lib/components/TrafficLight.svelte';
  import PropertyBox from '$lib/components/ui/PropertyBox.svelte';
  import TokenLogo from '$lib/components/TokenLogo.svelte';
  import CollapsibleBox from '$lib/components/ui/CollapsibleBox.svelte';
  import DetailsProperty from '$lib/components/ui/DetailsProperty.svelte';
  import type { Props } from './base.svelte';
  import Base from './base.svelte';
  import { MULTIPLIER_BASE, monthlyRate } from '$lib/web3/contracts/subscription';
  import type { ObservedQueryResult } from '$lib/query/config';
  import { convertedPretty, type Price } from '$lib/web3/contracts/oracle';
  import { prettyNumber } from '$lib/helpers';
  import { formatEther, formatUnits } from 'ethers';
  import type { BigNumberish } from '$lib/web3/contracts/common';
  import { ExplorerAccountUrl, ExplorerNftUrl } from '$lib/components/url';

  /** Data of the subscription */
  export let subscriptionData: Props['subscriptionData'];

  /** rate of spending in the subscription plan, based on 18 decimals */
  export let rate: Props['rate'];

  /** Data of the underlying payment token */
  export let paymentToken: Props['paymentToken'];

  /** Loads the USD price of the payment token */
  export let tokenPrice: ObservedQueryResult<Price | null>;

  /** open the technical details collapsible */
  export let technicalsOpen = false;

  const multiplier = subscriptionData.multiplier;
  const multiplierActive = multiplier > MULTIPLIER_BASE;

  const rawRate = Number(formatEther(monthlyRate(BigInt(rate))));
  const defaultRate = prettyNumber(rawRate);

  const multipliedRawRate = rawRate * (multiplier / 100);
  const multipliedRate = prettyNumber(multipliedRawRate);

  $: lockedAmount = BigInt(subscriptionData.unspent) - BigInt(subscriptionData.withdrawable);

  const tokenValueAsUsd = (value: bigint, price: Price | null) => {
    if (!price) {
      return undefined;
    }
    return convertedPretty(Number(formatUnits(value, paymentToken.decimals)), price);
  };

  $: usdPrice = (value: BigNumberish): string | undefined => {
    if (tokenPrice.isSuccess) {
      const usdValue = tokenValueAsUsd(BigInt(value), tokenPrice.data);
      if (usdValue) {
        return '$' + usdValue;
      }
    }

    return undefined;
  };

  $: rateUsd = (rate: number): string | undefined =>
    tokenPrice.isSuccess && tokenPrice.data
      ? convertedPretty(rate, tokenPrice.data)
      : undefined;

  const timeUnitsWithNames = (timeUnits: [number, number, number, number]) => {
    const names = ['y', 'd', 'h', 'm'];
    return timeUnits.map((u, i): [number, string] => [u, names[i]]).filter(([u]) => u > 0);
  };
</script>

<Base {subscriptionData} {rate} {paymentToken} let:formatTokenAmount let:unspent let:timeLeftUnits>
  {@const timeUnits = timeUnitsWithNames(timeLeftUnits)}
  <div class="p-4 text-foreground">
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
        titleLogo={Hourglass}
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
        titleLogo={Coins}
        subValue={usdPrice(subscriptionData.unspent)}
      >
        <div slot="value" class="text-sm font-medium leading-none">
          <span class="text-2xl font-bold">{unspent}</span>
          {paymentToken.symbol}
        </div>
      </PropertyBox>
      <PropertyBox
        title="Total deposited"
        titleLogo={Gem}
        subValue={usdPrice(subscriptionData.deposited)}
      >
        <div slot="value" class="text-sm font-medium leading-none">
          <span class="text-2xl font-bold">{formatTokenAmount(subscriptionData.deposited)}</span>
          {paymentToken.symbol}
        </div>
      </PropertyBox>
      <PropertyBox
        title="Total tipped"
        titleLogo={PiggyBank}
        subValue={usdPrice(subscriptionData.tips)}
      >
        <div slot="value" class="text-sm font-medium leading-none">
          <span class="text-2xl font-bold">{formatTokenAmount(subscriptionData.tips)}</span>
          {paymentToken.symbol}
        </div>
      </PropertyBox>
    </div>

    <!-- rate + multiplier, withdrawable, paused, token logo, subcontract name -->
    <div class="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
      <PropertyBox rootClass="border-0" title="Rate" titleLogo={Percent}>
        <div slot="value" class="flex items-center gap-4 pt-2">
          <TokenLogo
            class="basis-1/7 h-12 w-12"
            address={paymentToken.address}
            fallbackSymbol={paymentToken.symbol}
          />
          <div>
            {#if multiplierActive}
              <h4>Default</h4>
            {/if}
            <p class="text-sm font-medium leading-none">
              <span class="text-xl font-bold">{defaultRate}</span>
              {paymentToken.symbol} / month
            </p>
            {#if tokenPrice.data}
              <p class="text-xs text-muted-foreground">${rateUsd(rawRate)} / month</p>
            {/if}
          </div>
          {#if multiplierActive}
            <div>
              <h4>Multiplier {multiplier / 100}x</h4>
              <div>
                <p class="text-sm font-medium leading-none">
                  <span class="text-xl font-bold">{multipliedRate}</span>
                  {paymentToken.symbol} / month
                </p>
                {#if tokenPrice.data}
                  <p class="text-xs text-muted-foreground">${rateUsd(multipliedRawRate)} / month</p>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      </PropertyBox>
      <PropertyBox rootClass="border-0" title="Liquid funds" titleLogo={Droplet}>
        <div slot="value" class="flex items-center gap-4 pt-2">
          <div class="basis-1/2">
            <h4>Withdrawable</h4>
            <p>
              <span class="text-2xl font-bold"
                >{formatTokenAmount(subscriptionData.withdrawable)}</span
              >
              {paymentToken.symbol}
            </p>
            {#if tokenPrice.data}
              <p class="text-xs text-muted-foreground">{usdPrice(subscriptionData.withdrawable)}</p>
            {/if}
          </div>
          <div class="basis-1/2 pl-6">
            <h4>Locked</h4>
            <p>
              <span class="text-2xl font-bold">{formatTokenAmount(lockedAmount)}</span>
              {paymentToken.symbol}
            </p>
            {#if tokenPrice.data}
              <p class="text-xs text-muted-foreground">
                {usdPrice(lockedAmount)}
              </p>
            {/if}
          </div>
        </div>
      </PropertyBox>
    </div>

    <!-- technicals -->
    <CollapsibleBox rootClass="mt-4" title="Technical Details" open={technicalsOpen}>
      <DetailsProperty title="Address" help="The address of this contract">
        <div slot="value" class="flex items-center gap-2">
          <div>
            {subscriptionData.address}
          </div>
          <ExplorerAccountUrl address={subscriptionData.address} let:url>
            <Button variant="link" target="_blank" href={url} class="h-0 px-0 py-0">
              <ExternalLink class="size-4" />
            </Button>
          </ExplorerAccountUrl>
        </div>
      </DetailsProperty>
      <DetailsProperty title="Token Id" help="Id of the token">
        <div slot="value" class="flex items-center gap-2">
          <div>
            {subscriptionData.tokenId}
          </div>
          <ExplorerNftUrl
            contract={subscriptionData.address}
            tokenId={BigInt(subscriptionData.tokenId)}
            let:url
          >
            <Button variant="link" target="_blank" href={url} class="h-0 px-0 py-0">
              <ExternalLink class="size-4" />
            </Button>
          </ExplorerNftUrl>
        </div>
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
</Base>
