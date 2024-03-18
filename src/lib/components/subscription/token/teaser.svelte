<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { Button } from '$lib/components/ui/button';
  import { ChevronRight } from 'lucide-svelte';
  import Url from '$lib/components/Url.svelte';
  import TrafficLight from '$lib/components/TrafficLight.svelte';
  import type { Props } from './base.svelte';
  import Base from './base.svelte';

  /** Data of the subscription */
  export let subscriptionData: Props['subscriptionData'];

  /** rate of spending in the subscription plan, based on 18 decimals */
  export let rate: Props['rate'];

  export let paymentToken: Props['paymentToken'];

  const timeLeftUnit = (
    timeUnits: [number, number, number, number]
  ): [number, string] | undefined => {
    const names = ['year', 'day', 'hour', 'minute'];
    return timeUnits.map((u, i): [number, string] => [u, names[i]]).filter(([u]) => u > 0)[0];
  };
</script>

<Base {subscriptionData} {rate} {paymentToken} let:unspent let:timeLeft let:timeLeftUnits>
  {@const timeLeftWithUnit = timeLeftUnit(timeLeftUnits)}
  <Card.Root>
    <Card.Content class="p-4">
      <div class="flex items-center gap-2 sm:gap-6 sm:pl-2">
        <TrafficLight status={subscriptionData.isActive ? 'green' : 'red'} />
        <div>
          <p class="text-sm font-medium leading-none">
            <span class="text-xl font-bold">{unspent}</span>
            {paymentToken.symbol} remaining
          </p>
        </div>
        <div class="flex items-center gap-0 sm:gap-1 md:gap-2">
          <p class="text-sm font-medium leading-none">
            <Tooltip.Root>
              <Tooltip.Trigger>
                {#if subscriptionData.isActive && timeLeftWithUnit}
                  {@const [timeLeft, timeUnit] = timeLeftWithUnit}
                  <span class="text-xl font-bold">{timeLeft}</span>
                  {timeUnit + (timeLeft !== 1 ? 's' : '')} left
                {:else if subscriptionData.isActive}
                  <span class="text-xl font-bold">a few</span>
                  seconds left
                {:else}
                  <span class="text-xl font-bold">Expired</span>
                {/if}
              </Tooltip.Trigger>
              <Tooltip.Content>{timeLeft} seconds left</Tooltip.Content>
            </Tooltip.Root>
          </p>
        </div>
        <Url
          template={`/[network]/s/${subscriptionData.address}/${subscriptionData.tokenId}/`}
          let:path
        >
          <Button href={path} size="icon" class="ml-auto self-center justify-self-end">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Url>
      </div>
    </Card.Content>
  </Card.Root>
</Base>
