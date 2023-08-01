<script lang="ts">
  import { createEventDispatcher, type EventDispatcher } from 'svelte';
  import type { TxFailedEvents, WithdrawalEvents } from '../subscription-events';
  import Button from '$lib/components/Button.svelte';

  export let submitLabel: string;
  export let withdrawable: bigint;
  export let cancel: (dispatch: EventDispatcher<WithdrawalEvents>) => Promise<bigint>;

  const withdrawDispatch = createEventDispatcher<WithdrawalEvents>();
  const failDispatch = createEventDispatcher<TxFailedEvents>();
  let formDisabled = false;

  $: doCancel = async () => {
    try {
      formDisabled = true;
      await cancel(withdrawDispatch);
    } catch (err) {
      failDispatch('txFailed', err);
    } finally {
      formDisabled = false;
    }
  }
</script>

<div>
  <div>current withdrawable: {withdrawable}</div>
  <div>
    <Button type="button" isDisabled={formDisabled} label={submitLabel} primary={true} on:click={doCancel}/>
  </div>
</div>
