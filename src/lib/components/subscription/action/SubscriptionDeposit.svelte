<script lang="ts">
  import DepositForm from './deposit/DepositForm.svelte';
  import {
    type ApprovalEvents,
    type DepositEvents,
    type DepositSubscriptionEvents
  } from './subscription-events';
  import { createEventDispatcher, onMount, type EventDispatcher } from 'svelte';


  export let allowance: bigint;
  export let balance: bigint;

  export let approve: (amount: bigint, dispatch: EventDispatcher<ApprovalEvents>) => Promise<bigint>;

  export let renew: (
    amount: bigint,
    message: string,
    dispatch: EventDispatcher<DepositEvents>
  ) => Promise<[bigint, string]>;

  export let tip: (
    amount: bigint,
    message: string,
    dispatch: EventDispatcher<DepositEvents>
  ) => Promise<[bigint, string]>;

  export let updateData: () => Promise<void>;

  // TODO fixme
  let rate: bigint = 1;

  let counter = 0;

  onMount(() => counter = Math.random());

  const dispatch = createEventDispatcher<DepositSubscriptionEvents>();
</script>

<div>
  counter: {counter}
  <div>
    <h3>Renew</h3>
    <DepositForm
      {allowance}
      {balance}
      submitLabel="Renew"
      approve={approve}
      deposit={renew}
      maxAmount={balance}
      minAmount={rate}
      on:approved={async (ev) => {
        // TODO toast
        const [amount, hash] = ev.detail;
        await updateData();
        dispatch('approved', ev.detail);
      }}
      on:deposited={async (ev) => {
        // TODO toast
        const [amount, hash] = ev.detail;
        await updateData();

        dispatch('deposited', ev.detail);
      }}
      on:txFailed
      on:depositTxSubmitted
      on:approvalTxSubmitted
    />
  </div>
  <div>
    <h3>Tip</h3>
    <DepositForm
      {allowance}
      {balance}
      submitLabel="Tip"
      approve={approve}
      deposit={tip}
      maxAmount={balance}
      minAmount={0n}
      on:approved={async (ev) => {
        // TODO toast
        const [amount, hash] = ev.detail;
        await updateData();
        dispatch('approved', ev.detail);
      }}
      on:deposited={async (ev) => {
        // TODO toast
        const [amount, hash] = ev.detail;
        await updateData();

        dispatch('deposited', ev.detail);
      }}
      on:txFailed
      on:depositTxSubmitted
      on:approvalTxSubmitted
    />
  </div>
</div>
