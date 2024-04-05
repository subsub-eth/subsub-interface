<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { TxFailedEvents, WithdrawalEvents } from '../subscription-events';
  import NumberInput from '$lib/components/form/NumberInput.svelte';
  import Button from '$lib/components/Button.svelte';
  import {
    WithdrawPropsSchema,
    type WithdrawProps,
    type WithdrawalFunc
  } from '$lib/web3/contracts/subscription';
  import { createMutation } from '@tanstack/svelte-query';
  import { log } from '$lib/logger';
  import SuperDebug, { defaults, setError, superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import AmountInput from '$lib/components/form/AmountInput.svelte';

  export let formId: string;
  export let submitLabel: string;
  export let deposited: bigint;
  export let withdrawable: bigint;
  export let withdraw: WithdrawalFunc;
  export let minAmount = 10n;
  export let maxAmount = 100n;

  const withdrawDispatch = createEventDispatcher<WithdrawalEvents>();
  const failDispatch = createEventDispatcher<TxFailedEvents>();

  const withdrawMutation = createMutation({
    mutationFn: async ([amount]: Parameters<typeof withdraw>) =>
      withdraw(amount, {
        onWithdrawTxSubmitted: (hash) => withdrawDispatch('withdrawTxSubmitted', hash)
      }),
    onError: (error) => failDispatch('txFailed', error),
    onSuccess: ([amount, hash]) => {
      withdrawDispatch('withdrawn', [amount, hash]);
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
        failDispatch('txFailed', err);
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
