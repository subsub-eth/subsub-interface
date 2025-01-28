<script lang="ts">
  import TokenLogo from '$lib/components/TokenLogo.svelte';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { ChevronRight } from 'lucide-svelte';
  import ProgressRadial from '$lib/components/ui/ProgressRadial.svelte';
  import { type BaseProps, baseValues } from './base';
  import WarningTeaser from '$lib/components/ui2/WarningTeaser.svelte';
  import { convertedEtherPretty } from '$lib/web3/contracts/oracle';
  import { page } from '$app/state';
  import { url } from '$lib/url';

  interface Props extends BaseProps {
    /**
     * show owner in teaser
     */
    showOwner?: boolean;
  }

  let { contractData, paymentTokenData, tokenPrice, warnings, showOwner = false }: Props = $props();

  let { rawRate, rate, totalSupply, activeSubs } = $derived(baseValues({ contractData }));
</script>

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
          <p class="text-sm leading-none font-medium">Owner TODO</p>
        {/if}
        <h5 class="font-bold">
          {contractData.name}
        </h5>
      </div>
      <div>
        <p class="text-sm leading-none font-medium">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <span class="text-xl font-bold">{rate}</span>
            </Tooltip.Trigger>
            <Tooltip.Content>{String(rawRate)}</Tooltip.Content>
          </Tooltip.Root>
          {paymentTokenData.symbol}
          / month
        </p>
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
      </div>
      <div class="flex items-center gap-0 sm:gap-1 md:gap-2">
        <ProgressRadial
          width="w-6"
          stroke={100}
          font={200}
          value={(activeSubs / totalSupply) * 100}
        />
        <p class="text-sm leading-none font-medium">
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
      <Button
        href={url(`/[network]/s/${contractData.address}/`, page)}
        size="icon"
        class="ml-auto self-center justify-self-end"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </Card.Content>
</Card.Root>
