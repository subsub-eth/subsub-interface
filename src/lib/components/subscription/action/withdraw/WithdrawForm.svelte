<script lang="ts">
  import { reporter } from '@felte/reporter-svelte';
  import { validator } from '@felte/validator-zod';
  import { createForm } from 'felte';
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

  const { form } = createForm<WithdrawProps>({
    async onSubmit(val, { resetField }) {
      try {
        await $withdrawMutation.mutateAsync([val.amount]);
        resetField('amount');
      } catch (err) {
        log.error('An error occurred', err);
        failDispatch('txFailed', err);
      }
    },
    transform: (value: any) => {
      if (value.amount || value.amount === 0) value.amount = BigInt(value.amount);
      return value as WithdrawProps;
    },
    validate: (val) => {
      const errors: any = {};
      console.log('validate!', val);
      if (val.amount < minAmount) {
        errors.amount = [`too small, min ${minAmount.toString()}`];
      } else if (val.amount > maxAmount) {
        errors.amount = [`too big, max ${maxAmount.toString()}`];
      }
      return errors;
    },
    extend: [validator({ schema: WithdrawPropsSchema }), reporter]
  });
</script>

<div>
  <form use:form>
    <div>total deposit: {deposited}</div>
    <div>current withdrawable: {withdrawable}</div>
    <NumberInput name="amount" label="Amount" value={0} required />

    <div>
      <Button
        type="submit"
        isDisabled={$withdrawMutation.isPending}
        label={submitLabel}
        primary={true}
      />
    </div>
  </form>
</div>
