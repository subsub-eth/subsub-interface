<script lang="ts">
  import { createEventDispatcher, type EventDispatcher } from 'svelte';
  import Button from '../Button.svelte';
  import type { SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';
  import type { PauseEvents, UnpauseEvents } from '$lib/components/common-events';
  import Url from '../Url.svelte';
  import type {
    PauseSubscriptionContractEvents,
    UnpauseSubscriptionContractEvents
  } from './action/subscription-events';

  export let metadata: SubscriptionContractMetadata;
  export let pause: (dispatch: EventDispatcher<PauseEvents>) => Promise<void>;
  export let unpause: (dispatch: EventDispatcher<UnpauseEvents>) => Promise<void>;

  const dispatch = createEventDispatcher<
    PauseSubscriptionContractEvents & UnpauseSubscriptionContractEvents
  >();
</script>

<div>
  <div>
    claimable: {metadata.claimable}
  </div>
  <div>
    total claimed: {metadata.totalClaimed}
  </div>
  <div>
    paused: {metadata.paused}
  </div>

  <Url template="/[network]/s/[subscription]/edit/" let:path>
    <Button label="Edit" href={path} />
  </Url>
  <Button label="Claim" />
  {#if metadata.paused}
    <Button label="Unpause" on:click={() => unpause(dispatch)} />
  {:else}
    <Button label="Pause" on:click={() => pause(dispatch)} />
  {/if}
</div>
