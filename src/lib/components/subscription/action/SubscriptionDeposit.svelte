<script lang="ts">
  import type { ApproveFunc } from '$lib/web3/contracts/erc20';
  import type { DepositFunc } from '$lib/web3/contracts/subscription';
  import DepositForm from './deposit/DepositForm.svelte';

  export let tokenId: bigint;
  export let allowance: bigint;
  export let balance: bigint;

  export let approve: ApproveFunc;

  export let renew: DepositFunc;

  export let tip: DepositFunc;

  export let rate: bigint;

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
      on:approved
      on:deposited
      on:txFailed
      on:depositTxSubmitted
      on:approvalTxSubmitted
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
      on:approved
      on:deposited
      on:txFailed
      on:depositTxSubmitted
      on:approvalTxSubmitted
    />
  </div>
</div>
