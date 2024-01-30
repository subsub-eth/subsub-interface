<script lang="ts">
  import type { SubscriptionData } from '$lib/web3/contracts/subscription';
  import * as Card from '$lib/components/ui/card';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { Button } from '$lib/components/ui/button';
  import { ChevronRight } from 'lucide-svelte';
  import Url from '../Url.svelte';
  import TrafficLight from '../TrafficLight.svelte';
  import { formatUnits } from 'ethers';
  import { convertDecimals, prettyNumber } from '$lib/helpers';
  import type { Erc20Data } from '$lib/web3/contracts/erc20';
  import type { BigNumberish } from '$lib/web3/contracts/common';

  /** Data of the subscription */
  export let subscriptionData: SubscriptionData;

  /** rate of spending in the subscription plan, based on 18 decimals */
  export let rate: BigNumberish;

  export let paymentToken: Erc20Data;

  const unspent = prettyNumber(
    Number(formatUnits(subscriptionData.unspent, paymentToken.decimals))
  );

  // TODO block time implementation
  const timeLeft =
    convertDecimals(BigInt(subscriptionData.unspent), paymentToken.decimals, 18) / BigInt(rate);
  const timeLeftDays = timeLeft / 60n / 60n / 24n;
</script>

<Card.Root>
  <Card.Content class="p-4">
    <div class="flex items-center gap-2 sm:gap-6 sm:pl-2">
      <TrafficLight status={subscriptionData.isActive ? 'green' : 'red'} />
      <div>
        <p class="text-sm font-medium leading-none">
          <span class="text-xl font-bold">{unspent}</span>
          {paymentToken.symbol} deposited
        </p>
      </div>
      <div class="flex items-center gap-0 sm:gap-1 md:gap-2">
        <p class="text-sm font-medium leading-none">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <span class="text-xl font-bold">{timeLeftDays}</span> days left
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
