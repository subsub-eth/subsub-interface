<script lang="ts">
  import TokenLogo from '$lib/components/TokenLogo.svelte';
  import Url from '$lib/components/Url.svelte';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { ChevronRight } from 'lucide-svelte';
  import ProgressRadial from '$lib/components/ui/ProgressRadial.svelte';
  import Paused from '$lib/components/subscription/Paused.svelte';
  import Base from './base.svelte';
  import type { Props } from './base.svelte';
  import WarningTeaser from '$lib/components/ui2/WarningTeaser.svelte';

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

  /**
   * Warnings about the subscription plan
   */
  export let warnings: Props['warnings'];

  /**
   * show owner in teaser
   */
  export let showOwner = false;
</script>

<Base
  {contractData}
  {paymentTokenData}
  {tokenPrice}
  let:rate
  let:rawRate
  let:totalSupply
  let:activeSubs
  let:ratePrice
>
  <Card.Root>
    <Card.Content class="p-4">
      <div class="flex items-center gap-2 sm:gap-6">
        <TokenLogo
          class="mr-2"
          address={paymentTokenData.address}
          fallbackSymbol={paymentTokenData.symbol}
        />
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
            {paymentTokenData.symbol}
            / month
          </p>
          <p class="text-xs text-muted-foreground">
            {#if tokenPrice.isPending}
              ...
            {/if}
            {#if tokenPrice.isError}
              ???
            {/if}
            {#if tokenPrice.isSuccess && tokenPrice.data}
              ${ratePrice(tokenPrice.data)} / month
            {/if}
          </p>
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
          {#if warnings.isSuccess}
            <WarningTeaser messages={warnings.data} />
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
</Base>
