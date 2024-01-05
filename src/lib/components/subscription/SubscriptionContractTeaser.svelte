<script lang="ts">
  import type { SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';
  import TokenLogo from '../TokenLogo.svelte';
  import Url from '../Url.svelte';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { ChevronRight, PauseCircle } from 'lucide-svelte';
  import ProgressRadial from '$lib/components/ui/ProgressRadial.svelte';
    import Paused from './Paused.svelte';

  export let address: string;
  export let metadata: SubscriptionContractMetadata;

  export let showOwner = false;

  // TODO
  const tokenSymbol = 'USDT';
</script>

<Card.Root>
  <Card.Content class="p-4">
    <div class="flex items-center gap-2 sm:gap-6">
      <TokenLogo class="mr-2" address={metadata.token} fallbackSymbol={tokenSymbol} />
      <div class="">
        {#if showOwner}
          <p class="text-sm font-medium leading-none">Owner Jane</p>
        {/if}
        <h5 class="font-bold">
          {metadata.name}
        </h5>
      </div>
      <div>
        <p class="text-sm font-medium leading-none">
          <span class="text-xl font-bold">0.02</span>
          {tokenSymbol} / month
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
      <div class="flex items-center flex-auto justify-center">
        {#if metadata.paused}
          <Paused />
        {/if}
      </div>
      <Url template={`/[network]/s/${address}/`} let:path>
        <Button href={path} size="icon" class="ml-auto self-center justify-self-end">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Url>
    </div>
  </Card.Content>
</Card.Root>
