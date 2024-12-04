<script lang="ts">
  import type { TxFailedEvents, WithdrawalEvents } from '../subscription-events';
  import Button from '$lib/components/Button.svelte';
  import { WithdrawPropsSchema, type WithdrawalFunc } from '$lib/web3/contracts/subscription';
  import { createMutation } from '@tanstack/svelte-query';
  import { log } from '$lib/logger';
  import SuperDebug, { defaults, setError, superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import AmountInput from '$lib/components/form/AmountInput.svelte';

  interface Props extends WithdrawalEvents, TxFailedEvents {
    formId: string;
    submitLabel: string;
    deposited: bigint;
    withdrawable: bigint;
    withdraw: WithdrawalFunc;
    minAmount?: bigint;
    maxAmount?: bigint;
  }

  let {
    formId,
    submitLabel,
    deposited,
    withdrawable,
    withdraw,
    minAmount = 10n,
    maxAmount = 100n,
    onTxFailed,
    onWithdrawTxSubmitted,
    onWithdrawn
  }: Props = $props();

  const withdrawMutation = createMutation({
    mutationFn: async ([amount]: Parameters<typeof withdraw>) =>
      withdraw(amount, {
        onWithdrawTxSubmitted: (tx) => onWithdrawTxSubmitted?.(tx)
      }),
    onError: (error) => onTxFailed?.(error),
    onSuccess: ([amount, tx]) => {
      onWithdrawn?.(amount, tx);
    }
  });

  const form = superForm(defaults(zod(WithdrawPropsSchema)), {
    id: formId,
    SPA: true,
    dataType: 'json',
    validators: zod(
      WithdrawPropsSchema.refine(({ amount }) => amount === undefined || amount >= minAmount, {
        message: `too small, min ${minAmount.toString()}`,
        path: ['amount']
      }).refine(({ amount }) => amount === undefined || amount <= maxAmount, {
        message: `too big, max ${maxAmount.toString()}`,
        path: ['amount']
      })
    ),
    onUpdate: async ({ form }) => {
      if (!form.valid) {
        setError(form, 'invalid');
        return;
      }

      const val = form.data;
      try {
        await $withdrawMutation.mutateAsync([val.amount]);
      } catch (err) {
        log.error('An error occurred', err);
        onTxFailed?.(err);
      }
    }
  });

  const { form: formData, errors, enhance } = form;
</script>

<div>
  <form method="POST" use:enhance>
    <div>total deposit: {deposited}</div>
    <div>current withdrawable: {withdrawable}</div>
    <AmountInput {form} name="amount" label="Amount" bind:value={$formData.amount} required />

    <div>
      <Button
        type="submit"
        isDisabled={$withdrawMutation.isPending}
        label={submitLabel}
        primary={true}
      />
    </div>
    <div>
      {#if $errors._errors}
        {#each $errors._errors as err}
          {err}
        {/each}
      {/if}
    </div>
  </form>
  <SuperDebug data={formData} />
</div>
