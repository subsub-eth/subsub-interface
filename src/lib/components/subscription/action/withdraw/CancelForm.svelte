<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { TxFailedEvents, WithdrawalEvents } from '../subscription-events';
  import Button from '$lib/components/Button.svelte';
  import type { CancelFunc } from '$lib/web3/contracts/subscription';
  import { createMutation } from '@tanstack/svelte-query';

  export let submitLabel: string;
  export let withdrawable: bigint;
  export let cancel: CancelFunc;

  const withdrawDispatch = createEventDispatcher<WithdrawalEvents>();
  const failDispatch = createEventDispatcher<TxFailedEvents>();

  const cancelMutation = createMutation({
    mutationFn: async () =>
      cancel({
        onWithdrawTxSubmitted: (hash) => withdrawDispatch('withdrawTxSubmitted', hash)
      }),
    onError: (error) => failDispatch('txFailed', error),
    onSuccess: ([amount, hash]) => {
      withdrawDispatch('withdrawn', [amount, hash]);
    }
  });
</script>

<div>
  <div>current withdrawable: {withdrawable}</div>
  <div>
    <Button
      type="button"
      isDisabled={$cancelMutation.isPending}
      label={submitLabel}
      primary={true}
      on:click={() => $cancelMutation.mutate()}
    />
  </div>
</div>
