<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from '../Button.svelte';
  import type { SubscriptionContractData } from '$lib/web3/contracts/subscription';

  export let data: SubscriptionContractData;
  // export let unpause: (dispatch: EventDispatcher<UnpauseEvents>) => Promise<void>;
  // export let claim: (dispatch: EventDispatcher<ClaimEvents>) => Promise<void>;

  const dispatch = createEventDispatcher<any
  //   UnpauseSubscriptionContractEvents &
  >();
</script>

<div>
  <!-- <Button -->
  <!--   label="Claim" -->
  <!--   isLoading={claimProcessing} -->
  <!--   on:click={() => doClaim()} -->
  <!--   isDisabled={metadata.claimable == 0} -->
  <!-- /> -->
</div>
