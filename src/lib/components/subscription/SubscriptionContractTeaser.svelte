<script lang="ts">
  import TokenLogo from '../TokenLogo.svelte';
  import Url from '../Url.svelte';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { ChevronRight } from 'lucide-svelte';
  import ProgressRadial from '$lib/components/ui/ProgressRadial.svelte';
  import Paused from './Paused.svelte';
  import { monthlyRate, type SubscriptionContractData } from '$lib/web3/contracts/subscription';
  import type { Erc20Data } from '$lib/web3/contracts/erc20';
  import type { Address } from '$lib/web3/contracts/common';
  import { createQuery } from '@tanstack/svelte-query';
  import { formatEther, formatUnits } from 'ethers';
  import { prettyNumber } from '$lib/helpers';
  import type { Price } from '$lib/web3/contracts/oracle';
  import { ERC20, PRICE } from '$lib/query/keys';

  /**
   * Data of the subscription plan
   */
  export let contractData: SubscriptionContractData;

  /**
   * Function to load erc20 token data from
   */
  export let getErc20Data: (address: Address) => Promise<Erc20Data>;

  /**
   *  Function to load price data for the underlying erc20 token from
   */
  export let getPriceData: (address: Address) => Promise<Price | undefined>;

  /**
   * show owner in teaser
   */
  export let showOwner = false;

  const token = createQuery<Erc20Data>({
    queryKey: [ERC20, contractData.token],
    queryFn: async () => getErc20Data(contractData.token)
  });

  const price = createQuery<Price | false>({
    queryKey: [PRICE, contractData.token],
    queryFn: async () => {
      return (await getPriceData(contractData.token)) ?? false;
    }
  });

  const rawRate = formatEther(monthlyRate(BigInt(contractData.rate)));
  const rate = prettyNumber(Number(rawRate));

  // for simplicity: convert active subs but max out at totalSupply
  const totalSupply = Number(contractData.totalSupply);
  const activeSubs = Math.max(
    Math.floor(Number(BigInt(contractData.activeShares) / BigInt(100))),
    totalSupply
  );

  const ratePrice = (price: Price): string => {
    const rate = Number(rawRate);
    const p = Number(formatUnits(price.price, price.decimals));

    return prettyNumber(rate * p);
  };
</script>

<Card.Root>
  <Card.Content class="p-4">
    <div class="flex items-center gap-2 sm:gap-6">
      {#if $token.isPending}
        <TokenLogo
          class="mr-2"
          address={contractData.token}
          fallbackSymbol="..."
          isLoading={true}
        />
      {/if}
      {#if $token.isError}
        <TokenLogo class="mr-2" address={contractData.token} fallbackSymbol="?" />
      {/if}
      {#if $token.isSuccess}
        <TokenLogo class="mr-2" address={$token.data.address} fallbackSymbol={$token.data.symbol} />
      {/if}
      <div class="">
        {#if showOwner}
          <p class="text-sm font-medium leading-none">Owner Jane</p>
        {/if}
        <h5 class="font-bold">
          {contractData.name}
        </h5>
      </div>
      <div>
        <p class="text-sm font-medium leading-none">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <span class="text-xl font-bold">{rate}</span>
            </Tooltip.Trigger>
            <Tooltip.Content>{rawRate}</Tooltip.Content>
          </Tooltip.Root>
          {#if $token.isPending}
            ...
          {/if}
          {#if $token.isError}
            ???
          {/if}
          {#if $token.isSuccess}
            {$token.data.symbol}
          {/if}
          / month
        </p>
        {#if $price.isPending}
          ...
        {/if}
        {#if $price.isError}
          ???
        {/if}
        {#if $price.isSuccess && $price.data}
          <p class="text-xs text-muted-foreground">${ratePrice($price.data)} / month</p>
        {/if}
      </div>
      <div class="flex items-center gap-0 sm:gap-1 md:gap-2">
        <ProgressRadial
          width="w-6"
          stroke={100}
          font={200}
          value={(activeSubs / totalSupply) * 100}
        />
        <p class="text-sm font-medium leading-none">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <span class="text-xl font-bold">{activeSubs}</span> / {totalSupply} active
            </Tooltip.Trigger>
            <Tooltip.Content
              >{activeSubs} out of {totalSupply} subscriptions are active</Tooltip.Content
            >
          </Tooltip.Root>
        </p>
      </div>
      <div class="flex flex-auto items-center justify-center">
        <!-- TODO add other pause states -->
        {#if contractData.mintingPaused}
          <Paused />
        {/if}
      </div>
      <Url template={`/[network]/s/${contractData.address}/`} let:path>
        <Button href={path} size="icon" class="ml-auto self-center justify-self-end">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Url>
    </div>
  </Card.Content>
</Card.Root>
