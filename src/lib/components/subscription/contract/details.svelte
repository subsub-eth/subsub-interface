<script lang="ts" module>
  export interface Props extends BaseProps {
    contractBalance: BigNumberish;
    /** open the technical details collapsible */
    technicalsOpen?: boolean;
  }
</script>

<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import TokenLogo from '$lib/components/TokenLogo.svelte';
  import { DollarSign, ExternalLink, Activity, Users, Lock, Link } from 'lucide-svelte';
  import PropertyBox from '$lib/components/ui/PropertyBox.svelte';
  import DetailsProperty from '$lib/components/ui/DetailsProperty.svelte';
  import { Button } from '$lib/components/ui/button';
  import CollapsibleBox from '$lib/components/ui/CollapsibleBox.svelte';
  import { type BaseProps, baseValues } from './base';
  import { formatUnits } from '$lib/web3/helpers';
  import type { BigNumberish } from '$lib/web3/contracts/common';
  import WarningCollapsible from '$lib/components/ui2/WarningCollapsible.svelte';
  import { convertedEtherPretty } from '$lib/web3/contracts/oracle';
  import { prettyNumberFromString } from '$lib/helpers';
  import { accountUrl, tokenUrl } from '$lib/blockexplorer-url.svelte';
  import Markdown from '@magidoc/plugin-svelte-marked';

  let {
    contractData,
    paymentTokenData,
    tokenPrice,
    warnings,
    contractBalance,
    technicalsOpen = false
  }: Props = $props();

  let { rawRate, rate, totalSupply, activeSubs } = $derived(baseValues({ contractData }));

  let externalUrl: URL | null = $derived.by(() => {
    try {
      return contractData.externalUrl ? new URL(contractData.externalUrl) : null;
    } catch {
      return null;
    }
  });

  const formatFromGwei = (amount: BigNumberish) => prettyNumberFromString(formatUnits(amount, 18));
  const formatFromToken = (amount: BigNumberish) =>
    prettyNumberFromString(formatUnits(amount, paymentTokenData.decimals));
</script>

{#snippet properties()}
  <div class="grid gap-4 pt-4 sm:grid-cols-2 md:grid-cols-4">
    <PropertyBox title="Fee" TitleIcon={DollarSign}>
      {#snippet value()}
        <p class="text-sm leading-none font-medium">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <span class="text-xl font-bold">{rate}</span>
            </Tooltip.Trigger>
            <Tooltip.Content>{rawRate}</Tooltip.Content>
          </Tooltip.Root>
          {paymentTokenData.symbol}
          / month
        </p>
      {/snippet}
      {#snippet subValue()}
        <p class="text-muted-foreground text-xs">
          {#if tokenPrice.isPending}
            ...
          {/if}
          {#if tokenPrice.isError}
            ???
          {/if}
          {#if tokenPrice.isSuccess && tokenPrice.data}
            ${convertedEtherPretty(rawRate, tokenPrice.data)} / month
          {/if}
        </p>
      {/snippet}
    </PropertyBox>
    <PropertyBox title="Funds" TitleIcon={Activity}>
      {#snippet value()}
        <p class="text-sm leading-none font-medium">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <span class="text-xl font-bold">{formatFromToken(contractBalance)}</span>
            </Tooltip.Trigger>
            <Tooltip.Content>{String(contractBalance)}</Tooltip.Content>
          </Tooltip.Root>
          {paymentTokenData.symbol}
        </p>
      {/snippet}
      {#snippet subValue()}
        <p class="text-muted-foreground text-xs">
          {#if tokenPrice.isPending}
            ...
          {/if}
          {#if tokenPrice.isError}
            ???
          {/if}
          {#if tokenPrice.isSuccess && tokenPrice.data}
            ${convertedEtherPretty(BigInt(contractBalance), tokenPrice.data)}
          {/if}
        </p>
      {/snippet}
    </PropertyBox>
    <PropertyBox title="Active Subs" TitleIcon={Users}>
      {#snippet value()}
        <p class="text-xl font-bold">
          {String(activeSubs)}
        </p>
      {/snippet}
      {#snippet subValue()}
        <p class="text-muted-foreground text-xs">
          Total Subs: {String(totalSupply)}
        </p>
      {/snippet}
    </PropertyBox>
    <PropertyBox title="Lockup" TitleIcon={Lock} value={`${contractData.lock / 100}%`} />
  </div>
{/snippet}

{#snippet technicals()}
  <CollapsibleBox title="Technical Details" open={technicalsOpen}>
    <DetailsProperty title="Address" help="The address of this contract">
      {#snippet value()}
        <div class="flex items-center gap-2">
          <div>
            {contractData.address}
          </div>
          <Button
            variant="link"
            target="_blank"
            href={accountUrl(contractData.address)}
            class="h-0 px-0 py-0"
          >
            <ExternalLink class="h-4 w-4" />
          </Button>
        </div>
      {/snippet}
    </DetailsProperty>
    <DetailsProperty title="Owner" help="The owner of this contract">
      {#snippet value()}
        <div class="flex items-center gap-2">
          <div>
            {contractData.owner}
          </div>
          <Button
            variant="link"
            target="_blank"
            href={accountUrl(contractData.owner)}
            class="h-0 px-0 py-0"
          >
            <ExternalLink class="h-4 w-4" />
          </Button>
        </div>
      {/snippet}
    </DetailsProperty>
    <DetailsProperty title="Payment Token" help="The address of the payment token">
      {#snippet value()}
        <div class="flex items-center gap-2">
          <div>
            {contractData.token}
          </div>
          <Button
            variant="link"
            target="_blank"
            href={tokenUrl(contractData.token)}
            class="h-0 px-0 py-0"
          >
            <ExternalLink class="h-4 w-4" />
          </Button>
        </div>
      {/snippet}
    </DetailsProperty>

    <DetailsProperty
      title="Rate"
      value={`${formatFromGwei(contractData.rate)}`}
      help="The internal payment rate of token funds in gwei for a given time unit"
    />
    <DetailsProperty
      title="Lock"
      value={`${contractData.lock}`}
      help="The internal representation (10000 == 100%) of the amount of funds getting locked in the contract on deposit"
    />
    <!-- TODO determine time unit -->
    <DetailsProperty
      title="Epoch Size"
      value={`${contractData.epochSize} seconds`}
      help="The length of an epoch in time units"
    />

    <DetailsProperty
      title="Total Supply"
      value={`${contractData.totalSupply}`}
      help="The current total supply of minted subscription tokens"
    />
    <DetailsProperty
      title="Max Supply"
      value={`${contractData.maxSupply}`}
      help="The maximum supply of subscription tokens that can be minted"
    />
    <DetailsProperty
      title="Active Shares"
      value={`${contractData.activeShares}`}
      help="Subscriptions are internally represented as shares based on 100 shares equaling 1 subscription. Larger values represent a subscription with an applied multiplier"
    />

    <DetailsProperty
      title="Minting Paused"
      value={`${contractData.mintingPaused}`}
      help="Minting of new subscriptions is paused"
    />
    <DetailsProperty
      title="Renewal Paused"
      value={`${contractData.renewalPaused}`}
      help="Renewal of existing subscriptions is paused"
    />
    <DetailsProperty
      title="Tipping Paused"
      value={`${contractData.tippingPaused}`}
      help="Tipping on subscriptions is paused"
    />

    <DetailsProperty
      title="Claimable Funds"
      value={`${formatFromToken(contractData.claimable)} ${paymentTokenData.symbol}`}
      help="Currently unclaimed funds from subscriptions"
    />
    <DetailsProperty
      title="Claimed Subscription Funds"
      value={`${formatFromToken(contractData.depositsClaimed)} ${paymentTokenData.symbol}`}
      help="Claimed funds from subscriptions"
    />
    <DetailsProperty
      title="Claimed Tips"
      value={`${formatFromToken(contractData.tipsClaimed)} ${paymentTokenData.symbol}`}
      help="Claimed funds from tips"
    />
  </CollapsibleBox>
{/snippet}

<div class="text-foreground p-4">
  <!-- title -->
  <div class="flex items-center justify-between">
    <div class="bg-card flex flex-auto items-center gap-2 rounded-xl border-2 border-solid p-2">
      <TokenLogo
        class="mr-4 flex-none"
        address={contractData.token}
        fallbackSymbol={paymentTokenData.symbol}
      />
      <div class="grow text-xl font-bold">
        <h2>{contractData.name}</h2>
      </div>
      <div class="flex-none">
        {#if externalUrl}
          <Button class="h-4" variant="link" target="_blank" href={externalUrl.href}>
            <Link class="mr-0 h-4 w-4" />
            {externalUrl.host}
          </Button>
        {/if}
      </div>
    </div>
    {#if warnings.isPending}
      TODO Loading
    {/if}
    {#if warnings.isSuccess}
      <WarningCollapsible messages={warnings.data} />
    {/if}
  </div>

  <div class="flex flex-col justify-stretch gap-4 md:flex-row">
    <!-- image -->
    {#if contractData.image}
      <div class="mt-4 md:basis-1/2">
        <div>
          <img
            class="max-h-[50vh] w-full rounded-lg object-cover object-center"
            src={contractData.image}
            alt={contractData.name}
          />
        </div>
        {@render properties()}
        {@render technicals()}
      </div>
    {/if}
    <!-- Description -->
    {#if contractData.description}
      <Card.Root class="mt-4 pt-2 md:basis-1/2">
        <Card.Content>
          {#if contractData.description}
            <div class="flex items-center gap-2 pt-2">
              <div class="prose prose-base dark:prose-invert">
                <Markdown source={contractData.description} />
              </div>
            </div>
          {/if}
        </Card.Content>
      </Card.Root>
    {/if}
  </div>

  {#if !contractData.image}
    <!-- Main Properties -->
    {@render properties()}
    <!-- technicals -->
    {@render technicals()}
  {/if}
</div>
