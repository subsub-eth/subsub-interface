<script lang="ts">
  import type { ApproveFunc } from '$lib/web3/contracts/erc20';
  import type { DepositFunc } from '$lib/web3/contracts/subscription';
  import DepositForm from './deposit/DepositForm.svelte';
  import type { DepositEvents, ApprovalEvents, TxFailedEvents } from './subscription-events';

  interface Props extends DepositEvents, ApprovalEvents, TxFailedEvents {
    tokenId: bigint;
    allowance: bigint;
    balance: bigint;
    approve: ApproveFunc;
    renew: DepositFunc;
    tip: DepositFunc;
    rate: bigint;
  }

  let {
    tokenId,
    allowance,
    balance,
    approve,
    renew,
    tip,
    rate,
    onDeposited,
    onTxFailed,
    onDepositTxSubmitted,
    onApproved,
    onApprovalTxSubmitted
  }: Props = $props();
</script>

<div>
  <div>
    <h3>Renew</h3>
    <DepositForm
      formId={`${tokenId}-renew`}
      {allowance}
      {balance}
      submitLabel="Renew"
      {approve}
      deposit={renew}
      maxAmount={balance}
      minAmount={rate}
      {onApproved}
      {onDeposited}
      {onTxFailed}
      {onDepositTxSubmitted}
      {onApprovalTxSubmitted}
    />
  </div>
  <div>
    <h3>Tip</h3>
    <DepositForm
      formId={`${tokenId}-tip`}
      {allowance}
      {balance}
      submitLabel="Tip"
      {approve}
      deposit={tip}
      maxAmount={balance}
      minAmount={1n}
      {onApproved}
      {onDeposited}
      {onTxFailed}
      {onDepositTxSubmitted}
      {onApprovalTxSubmitted}
    />
  </div>
</div>
