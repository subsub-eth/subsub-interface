<script lang="ts">
  import { toStringArray } from '$lib/helpers';
</script>

<div class="max-w-(--breakpoint-lg)">
  <div>
    <h1 class="text-6xl font-bold">SubSub</h1>

    <h2 class="text-2xl font-bold">No Bullsh!t Subscriptions</h2>
  </div>

  <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
    {#snippet valueProp(title: string, description: string | string[])}
      {@const desc = toStringArray(description)}
      <div class="rounded-lg border p-4">
        <h3 class="mb-4 text-xl font-bold">{title}</h3>
        {#each desc as d (d)}
          <p>{d}</p>
        {/each}
      </div>
    {/snippet}

    {@render valueProp(
      'No protocol fees',
      'SubSub does not take any cut from your subscriptions or tips'
    )}
    {@render valueProp(
      'No Games - Pure Support',
      "There is no Pump'n'Dump! You subscribe to your favorite creators to support them. There is no degen speculation and no insiders to dump on you"
    )}
    {@render valueProp(
      'Permissionless',
      "Anyone can create a subscription plan and anyone can subscribe to it. It's an open system made for everybody"
    )}
    {@render valueProp('Subscribe and cancel at any time', [
      'You want to subscribe for a couple of days? - Sure!',
      'Want to cancel your subscription? - Refund your unused time! Subscriptions are paid by the second'
    ])}
    {@render valueProp(
      'Your subscription accrues value',
      'Your subscription is a unique object that tracks the funds and time you spent. These properties can be used to give you special perks!'
    )}
    {@render valueProp(
      'Transfer or even sell your subscription',
      "Your long-term subscription is valuable. If you don't want to continue your subscription, send it to a friend who appreciates it or sell it on a market place for its fair value"
    )}
  </div>
</div>
