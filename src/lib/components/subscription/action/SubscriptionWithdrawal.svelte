<script lang="ts">
  import { type WithdrawalEvents, type WithdrawSubscriptionEvents } from './subscription-events';
  import { createEventDispatcher, type EventDispatcher } from 'svelte';
  import WithdrawForm from './withdraw/WithdrawForm.svelte';
  import CancelForm from './withdraw/CancelForm.svelte';

  export let deposited: bigint;
  export let withdrawable: bigint;
  export let updateData: () => Promise<void>;

  export let withdraw: (
    amount: bigint,
    dispatch: EventDispatcher<WithdrawalEvents>
  ) => Promise<bigint>;
  export let cancel: (dispatch: EventDispatcher<WithdrawalEvents>) => Promise<bigint>;

  const dispatch = createEventDispatcher<WithdrawSubscriptionEvents>();

  const withdrawn = async (ev: CustomEvent<[bigint, string]>) => {
    // TODO toast
    const [amount, hash] = ev.detail;
    await updateData();

    dispatch('withdrawn', ev.detail);
  };
</script>

<div>
  <div>
    <h3>Withdraw</h3>
    <WithdrawForm
      {withdrawable}
      {deposited}
      submitLabel="Withdraw"
      {withdraw}
      maxAmount={withdrawable}
      minAmount={0n}
      on:withdrawn={withdrawn}
      on:txFailed
      on:withdrawTxSubmitted
    />
  </div>
  <div>
    <h3>Cancel</h3>
    <CancelForm
      {withdrawable}
      {cancel}
      submitLabel="Cancel"
      on:withdrawn={withdrawn}
      on:txFailed
      on:withdrawTxSubmitted
    />
  </div>
</div>
