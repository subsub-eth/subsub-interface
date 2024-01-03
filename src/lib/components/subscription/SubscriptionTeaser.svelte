<script lang="ts">
  import type { SubscriptionTokenMetadata } from '$lib/web3/contracts/subscription';
  import * as Card from '$lib/components/ui/card';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { Button } from '$lib/components/ui/button';
  import { ChevronRight } from 'lucide-svelte';
  import Url from '../Url.svelte';
  import TrafficLight from '../TrafficLight.svelte';

  /**
   * Address of the contract this token is defined in
   */
  export let contractAddress: string;

  /** Id of the subscription token */
  export let tokenId: bigint;

  /** Metadata of the subscription */
  export let metadata: SubscriptionTokenMetadata;
</script>

<Card.Root>
  <Card.Content class="p-4">
    <div class="flex items-center gap-2 sm:gap-6 sm:pl-2">
      <TrafficLight />
      <div>
        <p class="text-sm font-medium leading-none">
          <span class="text-xl font-bold">0.02</span>
          deposited
        </p>
        <p class="text-xs text-muted-foreground">$2.02 / month</p>
      </div>
      <div class="flex items-center gap-0 sm:gap-1 md:gap-2">
        <p class="text-sm font-medium leading-none">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <span class="text-xl font-bold">10</span> days left
            </Tooltip.Trigger>
            <Tooltip.Content>10000 blocks left</Tooltip.Content>
          </Tooltip.Root>
        </p>
      </div>
      <Url template={`/[network]/s/${contractAddress}/${tokenId}/`} let:path>
        <Button href={path} size="icon" class="ml-auto self-center justify-self-end">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Url>
    </div>
  </Card.Content>
</Card.Root>
