<script lang="ts">
  import type { SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';
  import TokenLogo from '../TokenLogo.svelte';
  import Url from '../Url.svelte';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { ChevronRight, PauseCircle } from 'lucide-svelte';

  export let address: string;
  export let metadata: SubscriptionContractMetadata;

  export let showOwner = false;

  // TODO
  const tokenSymbol = 'USDT';
</script>

<Card.Root>
  <Card.Content>
    <div class="flex items-center">
      <TokenLogo symbol={tokenSymbol} />
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
      <div>
        <p class="text-sm font-medium leading-none">
          <span class="text-xl font-bold">10</span> / 200 Subs active
        </p>
      </div>
      <div>
        {#if metadata.paused}
          <Tooltip.Root>
            <Tooltip.Trigger>
              <PauseCircle class="h-8 w-8" />
            </Tooltip.Trigger>
            <Tooltip.Content>
              Subscription Plan is paused and does not accept renewals
            </Tooltip.Content>
          </Tooltip.Root>
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
