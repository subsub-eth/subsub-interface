<script lang="ts">
  import { reporter } from '@felte/reporter-svelte';
  import { validator } from '@felte/validator-zod';
  import { createForm } from 'felte';
  import { createEventDispatcher, type EventDispatcher } from 'svelte';
  import type { TxFailedEvents, WithdrawalEvents } from '../subscription-events';
  import NumberInput from '$lib/components/form/NumberInput.svelte';
  import Button from '$lib/components/Button.svelte';
  import { WithdrawPropsSchema, type WithdrawProps } from '$lib/web3/contracts/subscription';

  export let submitLabel: string;
  export let deposited: bigint;
  export let withdrawable: bigint;
  export let withdraw: (
    amount: bigint,
    dispatch: EventDispatcher<WithdrawalEvents>
  ) => Promise<bigint>;
  export let minAmount = 10n;
  export let maxAmount = 100n;

  const withdrawDispatch = createEventDispatcher<WithdrawalEvents>();
  const failDispatch = createEventDispatcher<TxFailedEvents>();
  let formDisabled = false;

  const { form } = createForm<WithdrawProps>({
    async onSubmit(val, { resetField }) {
      try {
        formDisabled = true;
        await withdraw(val.amount, withdrawDispatch);
        resetField('amount');
      } catch (err) {
        console.error('An error occurred', err);
        failDispatch('txFailed', err);
      } finally {
        formDisabled = false;
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
        errors.amount = ['too small'];
      } else if (val.amount > maxAmount) {
        errors.amount = ['too big'];
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
      <Button type="submit" isDisabled={formDisabled} label={submitLabel} primary={true} />
    </div>
  </form>
</div>
