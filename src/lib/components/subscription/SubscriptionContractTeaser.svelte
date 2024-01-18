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
  import { formatEther } from 'ethers';
  import { prettyNumber } from '$lib/helpers';

  export let contractData: SubscriptionContractData;

  export let getErc20Data: (address: Address) => Promise<Erc20Data>;

  export let showOwner = false;

  const token = createQuery<Erc20Data>({
    queryKey: ['erc20', contractData.token],
    queryFn: async () => getErc20Data(contractData.token)
  });

  const rawRate = formatEther(monthlyRate(contractData.rate));
  const rate = prettyNumber(Number(rawRate));
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
        <p class="text-xs text-muted-foreground">$2.02 / month</p>
      </div>
      <div class="flex items-center gap-0 sm:gap-1 md:gap-2">
        <ProgressRadial width="w-6" stroke={100} font={200} value={(10 / 200) * 100} />
        <p class="text-sm font-medium leading-none">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <span class="text-xl font-bold">10</span> / 200 active
            </Tooltip.Trigger>
            <Tooltip.Content>10 out of 200 subscriptions are active</Tooltip.Content>
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
