<script lang="ts">
  import {
    DepositPropsSchema,
    type DepositProps,
    type DepositFunc
  } from '$lib/web3/contracts/subscription';
  import { reporter } from '@felte/reporter-svelte';
  import { validator } from '@felte/validator-zod';
  import { createForm } from 'felte';
  import { createEventDispatcher } from 'svelte';
  import type { ApprovalEvents, DepositEvents, TxFailedEvents } from '../subscription-events';
  import NumberInput from '$lib/components/form/NumberInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import Button from '$lib/components/Button.svelte';
  import type { ApproveFunc } from '$lib/web3/contracts/erc20';
  import { createMutation } from '@tanstack/svelte-query';
  import { log } from '$lib/logger';

  export let allowance: bigint;
  export let balance: bigint;
  export let submitLabel: string;
  export let approve: ApproveFunc;
  export let deposit: DepositFunc;
  export let minAmount = 10n;
  export let maxAmount = 100n;

  const depositDispatch = createEventDispatcher<DepositEvents>();
  const approvalDispatch = createEventDispatcher<ApprovalEvents>();
  const failDispatch = createEventDispatcher<TxFailedEvents>();

  const approveMutation = createMutation({
    mutationFn: async ([amount]: Parameters<typeof approve>) =>
      approve(amount, {
        onApprovalTxSubmitted: (hash) => approvalDispatch('approvalTxSubmitted', hash)
      }),
    onError: (error) => failDispatch('txFailed', error),
    onSuccess: ([amount, hash]) => {
      approvalDispatch('approved', [amount, hash]);
    }
  });

  const depositMutation = createMutation({
    mutationFn: async ([amount, message]: Parameters<typeof deposit>) =>
      deposit(amount, message, {
        onDepositTxSubmitted: (hash) => depositDispatch('depositTxSubmitted', hash)
      }),
    onError: (error) => failDispatch('txFailed', error),
    onSuccess: ([amount, , hash]) => {
      depositDispatch('deposited', [amount, hash]);
    }
  });

  let approvalMode = true;

  const { form, data } = createForm<DepositProps>({
    async onSubmit(val, { resetField }) {
      try {
        if (approvalMode) {
          await $approveMutation.mutateAsync([val.amount]);
        } else {
          await $depositMutation.mutateAsync([val.amount, val.message ?? '']);
          resetField('amount');
        }
      } catch (err) {
        log.error('An error occurred on deposit', err);
        throw err;
      }
    },
    transform: (value: any) => {
      if (value.amount || value.amount === 0) value.amount = BigInt(value.amount);
      return value as DepositProps;
    },
    validate: (val) => {
      const errors: any = {};
      if (val.amount < minAmount) {
        errors.amount = [`too small, min ${minAmount.toString()}`];
      } else if (val.amount > maxAmount) {
        errors.amount = [`too big, max ${maxAmount.toString()}`];
      }
      return errors;
    },
    extend: [validator({ schema: DepositPropsSchema }), reporter]
  });

  $: {
    approvalMode = allowance < $data?.amount;
  }
</script>

<div>
  <form use:form>
    <div>current balance: {balance}</div>
    <div>current allowance: {allowance}</div>
    <NumberInput name="amount" label="Amount" value={0} required />
    <TextInput name="message" label="Message" disabled={approvalMode} />

    <div>
      <Button
        type="submit"
        isDisabled={$depositMutation.isPending || $approveMutation.isPending}
        label={approvalMode ? 'Approve' : submitLabel}
        primary={true}
      />
    </div>
  </form>
</div>
