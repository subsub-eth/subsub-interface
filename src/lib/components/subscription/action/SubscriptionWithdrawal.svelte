<script lang="ts">
  import { type Subscription } from '@createz/contracts/types/ethers-contracts';
  import { type WithdrawalEvents, type WithdrawSubscriptionEvents } from './subscription-events';
  import { createEventDispatcher, type EventDispatcher } from 'svelte';
  import WithdrawForm from './withdraw/WithdrawForm.svelte';
  import { findLog, getReceipt } from '$lib/web3/ethers';
  import CancelForm from './withdraw/CancelForm.svelte';
  import { endWith } from 'rxjs';

  export let subContract: Subscription;
  export let subscriptionId: bigint;

  let depositedAmount: bigint;
  let withdrawableAmount: bigint;

  const dispatch = createEventDispatcher<WithdrawSubscriptionEvents>();

  const loadPositionData = async (
    subContract: Subscription,
    subscriptionId: bigint
  ): Promise<[bigint, bigint]> => {
    depositedAmount = await subContract.deposited(subscriptionId);
    withdrawableAmount = await subContract.withdrawable(subscriptionId);

    return [depositedAmount, withdrawableAmount];
  };

  $: withdraw = async (
    amount: bigint,
    dispatch: EventDispatcher<WithdrawalEvents>
  ): Promise<bigint> => {
    const tx = await subContract.withdraw(subscriptionId, amount);
    dispatch('withdrawTxSubmitted', tx.hash);

    const receipt = await getReceipt(tx);
    dispatch('withdrawn', [amount, receipt.hash]);
    return amount;
  };

  $: cancel = async (dispatch: EventDispatcher<WithdrawalEvents>): Promise<bigint> => {
    const tx = await subContract.cancel(subscriptionId);
    dispatch('withdrawTxSubmitted', tx.hash);

    const withdrawnEvent = await findLog(
      tx,
      subContract,
      subContract.filters.SubscriptionWithdrawn(subscriptionId)
    );
    if (!withdrawnEvent) {
      throw new Error('Transaction Log not found');
    }
    const amount = withdrawnEvent?.args.removedAmount;
    dispatch('withdrawn', [amount, tx.hash]);
    return amount;
  };
</script>

<div>
  {#await loadPositionData(subContract, subscriptionId)}
    Loading...
  {:then _}
    <div>
      <h3>Withdraw</h3>
      <WithdrawForm
        withdrawable={withdrawableAmount}
        deposited={depositedAmount}
        submitLabel="Withdraw"
        {withdraw}
        maxAmount={withdrawableAmount}
        minAmount={0n}
        on:withdrawn={async (ev) => {
          // TODO toast
          const [amount, hash] = ev.detail;
          await loadPositionData(subContract, subscriptionId);

          dispatch('withdrawn', ev.detail);
        }}
        on:txFailed
        on:withdrawTxSubmitted
      />
    </div>
    <div>
      <h3>Cancel</h3>
      <CancelForm withdrawable={withdrawableAmount} {cancel} submitLabel="Cancel" />
    </div>
  {/await}
</div>
