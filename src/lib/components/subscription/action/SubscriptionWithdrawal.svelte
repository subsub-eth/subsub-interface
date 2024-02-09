<script lang="ts">
  import WithdrawForm from './withdraw/WithdrawForm.svelte';
  import CancelForm from './withdraw/CancelForm.svelte';
  import type { CancelFunc, WithdrawalFunc } from '$lib/web3/contracts/subscription';

  export let deposited: bigint;
  export let withdrawable: bigint;

  export let withdraw: WithdrawalFunc;
  export let cancel: CancelFunc;

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
      on:withdrawn
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
      on:withdrawn
      on:txFailed
      on:withdrawTxSubmitted
    />
  </div>
</div>
