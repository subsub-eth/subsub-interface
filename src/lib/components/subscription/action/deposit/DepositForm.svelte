<script lang="ts">
  import { DepositPropsSchema, type DepositProps } from '$lib/web3/contracts/subscription';
  import { reporter } from '@felte/reporter-svelte';
  import { validator } from '@felte/validator-zod';
  import { createForm } from 'felte';
  import { createEventDispatcher, type EventDispatcher } from 'svelte';
  import type { ApprovalEvents, DepositEvents, TxFailedEvents } from '../subscription-events';
  import NumberInput from '$lib/components/form/NumberInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';

  export let allowance: bigint;
  export let balance: bigint;
  export let submitLabel: string;
  export let approve: (
    amount: bigint,
    dispatch: EventDispatcher<ApprovalEvents>
  ) => Promise<bigint>;
  export let deposit: (
    amount: bigint,
    message: string,
    dispatch: EventDispatcher<DepositEvents>
  ) => Promise<[bigint, string]>;
  export let minAmount = 10n;
  export let maxAmount = 100n;

  const depositDispatch = createEventDispatcher<DepositEvents>();
  const approvalDispatch = createEventDispatcher<ApprovalEvents>();
  const failDispatch = createEventDispatcher<TxFailedEvents>();
  let formDisabled = false;

  let approvalMode = true;

  const { form, data } = createForm<DepositProps>({
    async onSubmit(val, { resetField }) {
      try {
        formDisabled = true;
        if (approvalMode) {
          await approve(val.amount, approvalDispatch);
        } else {
          await deposit(val.amount, val.message ?? '', depositDispatch);
          resetField('amount');
        }
      } catch (err) {
        console.error('An error occurred', err);
        failDispatch('txFailed', err);
      } finally {
        formDisabled = false;
      }
    },
    transform: (value: any) => {
      if (value.amount || value.amount === 0) value.amount = BigInt(value.amount);
      return value as DepositProps;
    },
    validate: (val) => {
      const errors: any = {};
      console.log('validate!', val);
      if (val.amount < minAmount) {
        errors.amount = ['too small'];
      } else if (val.amount > maxAmount) {
        errors.amount = ['too big'];
      }
      return errors;
    },
    extend: [validator({ schema: DepositPropsSchema }), reporter]
  });

  $: {
    console.log('data', $data);
    // TODO why does this break?
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
      <button type="submit" disabled={formDisabled}>{approvalMode ? 'Approve' : submitLabel}</button
      >
    </div>
  </form>
</div>
