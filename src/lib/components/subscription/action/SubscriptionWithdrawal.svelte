<script lang="ts">
  import WithdrawForm from './withdraw/WithdrawForm.svelte';
  import CancelForm from './withdraw/CancelForm.svelte';
  import type { CancelFunc, WithdrawalFunc } from '$lib/web3/contracts/subscription';
  import type { WithdrawalEvents, TxFailedEvents } from './subscription-events';

  interface Props extends WithdrawalEvents, TxFailedEvents {
    tokenId: bigint;
    deposited: bigint;
    withdrawable: bigint;
    withdraw: WithdrawalFunc;
    cancel: CancelFunc;
  }

  let {
    tokenId,
    deposited,
    withdrawable,
    withdraw,
    cancel,
    onTxFailed,
    onWithdrawn,
    onWithdrawTxSubmitted
  }: Props = $props();
</script>

<div>
  <div>
    <h3>Withdraw</h3>
    <WithdrawForm
      formId={`${tokenId}-withdraw`}
      {withdrawable}
      {deposited}
      submitLabel="Withdraw"
      {withdraw}
      maxAmount={withdrawable}
      minAmount={1n}
      {onWithdrawn}
      {onTxFailed}
      {onWithdrawTxSubmitted}
    />
  </div>
  <div>
    <h3>Cancel</h3>
    <CancelForm
      {withdrawable}
      {cancel}
      submitLabel="Cancel"
      {onWithdrawn}
      {onTxFailed}
      {onWithdrawTxSubmitted}
    />
  </div>
</div>
