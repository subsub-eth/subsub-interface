<script lang="ts">
  import { createForm } from 'felte';

  import NumberInput from '../../form/NumberInput.svelte';
  import TextInput from '../../form/TextInput.svelte';
  import { type MintProps, MintPropsSchema } from '$lib/web3/contracts/subscription';
  import { validator } from '@felte/validator-zod';
  import { reporter } from '@felte/reporter-svelte';
  import { createEventDispatcher, type EventDispatcher } from 'svelte';
  import type { MintEvents, MintSubscriptionEvents } from './subscription-events';
  import Button from '$lib/components/Button.svelte';
  import type { ApprovalEvents } from '$lib/web3/contracts/erc20';

  // TODO handle approval/permit, permit2?

  export let allowance: bigint;
  export let balance: bigint;

  export let mint: (
    amount: bigint,
    multiplier: number,
    message: string,
    dispatch: EventDispatcher<MintEvents>
  ) => Promise<[bigint, bigint, string]>;

  export let approve: (
    amount: bigint,
    dispatch: EventDispatcher<ApprovalEvents>
  ) => Promise<bigint>;

  export let update: () => Promise<void>;

  const dispatch = createEventDispatcher<MintSubscriptionEvents>();
  let formDisabled = false;

  let needsApproval = true;

  const doApprove = async (val: MintProps) => {
    if (val.amount > 0) {
      await approve(val.amount, dispatch);
      await update();
    } else {
      throw new Error('Approval of 0 amount or token not found');
    }
  };

  const doMint = async (val: MintProps) => {
    await mint(val.amount, val.multiplier, val.message ?? '', dispatch);
    await update();
  };

  let action = doApprove;

  // soften cyclic dependency
  const setAction = (func: (val: MintProps) => Promise<void>) => (action = func);

  const { form, data } = createForm<MintProps>({
    async onSubmit(val) {
      console.log('submitted', val);

      try {
        formDisabled = true;
        await action(val);
      } catch (err) {
        console.error('An error occurred', err);
        dispatch('txFailed', err);
      } finally {
        formDisabled = false;
      }
    },
    transform: (value: any) => {
      if (value.amount || value.amount === 0) value.amount = BigInt(value.amount);

      return value as MintProps;
    },
    extend: [validator({ schema: MintPropsSchema }), reporter]
  });

  $: needsApproval = allowance < $data.amount;

  $: {
    if (needsApproval) {
      setAction(doApprove);
    } else {
      setAction(doMint);
    }
  }
</script>

<div>
  <form use:form>
    <div>current balance: {balance}</div>
    <NumberInput name="amount" label="Amount" value={0} required />
    <NumberInput
      name="multiplier"
      label="Multiplier"
      value={100}
      disabled={needsApproval}
      required
    />
    <TextInput name="message" label="Message" disabled={needsApproval} />

    <div>
      <Button
        primary={true}
        label={needsApproval ? 'Approve' : 'Create'}
        type="submit"
        isDisabled={formDisabled}
      />
    </div>
  </form>
</div>
