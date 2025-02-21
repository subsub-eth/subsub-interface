<script lang="ts">
  import { DepositPropsSchema, type DepositFunc } from '$lib/web3/contracts/subscription';
  import type { ApprovalEvents, DepositEvents, TxFailedEvents } from '../subscription-events';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import Button from '$lib/components/Button.svelte';
  import type { ApproveFunc } from '$lib/web3/contracts/erc20';
  import { createMutation } from '@tanstack/svelte-query';
  import { log } from '$lib/logger';
  import SuperDebug, { defaults, setError, superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import AmountInput from '$lib/components/form/AmountInput.svelte';

  interface Props extends DepositEvents, ApprovalEvents, TxFailedEvents {
    formId?: string;
    allowance: bigint;
    balance: bigint;
    submitLabel: string;
    approve: ApproveFunc;
    deposit: DepositFunc;
    minAmount?: bigint;
    maxAmount?: bigint;
  }

  let {
    formId = 'subscription-deposit',
    allowance,
    balance,
    submitLabel,
    approve,
    deposit,
    minAmount = 10n,
    maxAmount = 100n,
    onApprovalTxSubmitted,
    onApproved,
    onDeposited,
    onDepositTxSubmitted,
    onTxFailed
  }: Props = $props();

  const approveMutation = createMutation({
    mutationFn: async ([amount]: Parameters<typeof approve>) =>
      approve(amount, {
        onApprovalTxSubmitted: (tx) => onApprovalTxSubmitted?.(tx)
      }),
    onError: (error) => onTxFailed?.(error),
    onSuccess: ([amount, tx]) => {
      onApproved?.(amount, tx);
    }
  });

  const depositMutation = createMutation({
    mutationFn: async ([amount, message]: Parameters<typeof deposit>) =>
      deposit(amount, message, {
        onDepositTxSubmitted: (tx) => onDepositTxSubmitted?.(tx)
      }),
    onError: (error) => onTxFailed?.(error),
    onSuccess: ([amount, , tx]) => {
      onDeposited?.(amount, tx);
    }
  });

  let approvalMode = $state(true);

  const form = superForm(defaults(zod(DepositPropsSchema)), {
    id: formId,
    SPA: true,
    dataType: 'json',
    resetForm: () => !approvalMode,
    validators: zod(
      DepositPropsSchema.refine(({ amount }) => amount === undefined || amount >= minAmount, {
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
        if (approvalMode) {
          await $approveMutation.mutateAsync([val.amount]);
        } else {
          await $depositMutation.mutateAsync([val.amount, val.message ?? '']);
        }
      } catch (err) {
        log.error('An error occurred on deposit', err);
        throw err;
      }
    }
  });

  const { form: formData, errors, enhance } = form;

  $effect(() => {
    approvalMode = allowance < ($formData.amount ?? 0n);
  });
</script>

<div>
  <form method="POST" use:enhance>
    <div>current balance: {balance}</div>
    <div>current allowance: {allowance}</div>
    <AmountInput {form} name="amount" label="Amount" bind:value={$formData.amount} required />
    <TextInput
      {form}
      bind:value={$formData.message}
      name="message"
      label="Message"
      disabled={approvalMode}
    />

    <div>
      <Button type="submit" disabled={$depositMutation.isPending || $approveMutation.isPending}
        >{approvalMode ? 'Approve' : submitLabel}
      </Button>
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
