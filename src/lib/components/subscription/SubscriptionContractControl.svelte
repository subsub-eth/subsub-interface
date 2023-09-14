<script lang="ts">
  import { createEventDispatcher, type EventDispatcher } from 'svelte';
  import Button from '../Button.svelte';
  import type { SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';
  import type { PauseEvents, UnpauseEvents } from '$lib/components/common-events';
  import Url from '../Url.svelte';
  import type {
    ClaimEvents,
    ClaimSubscriptionContractEvents,
    PauseSubscriptionContractEvents,
    UnpauseSubscriptionContractEvents
  } from './action/subscription-events';

  export let metadata: SubscriptionContractMetadata;
  export let pause: (dispatch: EventDispatcher<PauseEvents>) => Promise<void>;
  export let unpause: (dispatch: EventDispatcher<UnpauseEvents>) => Promise<void>;
  export let claim: (dispatch: EventDispatcher<ClaimEvents>) => Promise<void>;

  let claimProcessing = false;
  let pauseProcessing = false;

  const dispatch = createEventDispatcher<
    PauseSubscriptionContractEvents &
      UnpauseSubscriptionContractEvents &
      ClaimSubscriptionContractEvents
  >();

  const doClaim = async () => {
    claimProcessing = true;
    try {
      await claim(dispatch);
    } finally {
      claimProcessing = false;
    }
  };

  const doPauseAction = async (
    action: (
      dispatcher: EventDispatcher<PauseEvents> | EventDispatcher<UnpauseEvents>
    ) => Promise<void>
  ) => {
    pauseProcessing = true;
    try {
      await action(dispatch);
    } finally {
      pauseProcessing = false;
    }
  };
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
  <Button
    label="Claim"
    isLoading={claimProcessing}
    on:click={() => doClaim()}
    isDisabled={metadata.claimable == 0}
  />
  {#if metadata.paused}
    <Button label="Unpause" isLoading={pauseProcessing} on:click={() => doPauseAction(unpause)} />
  {:else}
    <Button label="Pause" isLoading={pauseProcessing} on:click={() => doPauseAction(pause)} />
  {/if}
</div>
