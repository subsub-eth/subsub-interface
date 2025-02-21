<script lang="ts">
  import type { TxFailedEvents, WithdrawalEvents } from '../subscription-events';
  import Button from '$lib/components/Button.svelte';
  import type { CancelFunc } from '$lib/web3/contracts/subscription';
  import { createMutation } from '@tanstack/svelte-query';

  interface Props extends WithdrawalEvents, TxFailedEvents {
    submitLabel: string;
    withdrawable: bigint;
    cancel: CancelFunc;
  }

  let { submitLabel, withdrawable, cancel, onWithdrawTxSubmitted, onWithdrawn, onTxFailed }: Props =
    $props();

  const cancelMutation = createMutation({
    mutationFn: async () =>
      cancel({
        onWithdrawTxSubmitted: (tx) => onWithdrawTxSubmitted?.(tx)
      }),
    onError: (error) => onTxFailed?.(error),
    onSuccess: ([amount, tx]) => {
      onWithdrawn?.(amount, tx);
    }
  });
</script>

<div>
  <div>current withdrawable: {withdrawable}</div>
  <div>
    <Button
      type="button"
      disabled={$cancelMutation.isPending}
      onclick={() => $cancelMutation.mutate()}
    >
      {submitLabel}
    </Button>
  </div>
</div>
