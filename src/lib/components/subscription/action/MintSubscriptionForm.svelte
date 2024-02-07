<script lang="ts">
  import { createForm } from 'felte';

  import NumberInput from '../../form/NumberInput.svelte';
  import TextInput from '../../form/TextInput.svelte';
  import { type MintProps, MintPropsSchema, type MintFunc } from '$lib/web3/contracts/subscription';
  import { validator } from '@felte/validator-zod';
  import { reporter } from '@felte/reporter-svelte';
  import { createEventDispatcher } from 'svelte';
  import type { MintSubscriptionEvents } from './subscription-events';
  import Button from '$lib/components/Button.svelte';
  import type { ApproveFunc } from '$lib/web3/contracts/erc20';
  import { createMutation } from '@tanstack/svelte-query';
  import { log } from '$lib/logger';

  // TODO handle approval/permit, permit2?

  export let allowance: bigint;
  export let balance: bigint;

  export let mint: MintFunc;

  export let approve: ApproveFunc;

  const dispatch = createEventDispatcher<MintSubscriptionEvents>();

  let needsApproval = true;

  const approveMutation = createMutation({
    mutationFn: async ([amount]: Parameters<typeof approve>) =>
      approve(amount, { onApprovalTxSubmitted: (hash) => dispatch('approvalTxSubmitted', hash) }),
    onError: (error) => dispatch('txFailed', error),
    onSuccess: (amount) => {
      dispatch('approved', amount);
    }
  });

  const mintMutation = createMutation({
    mutationFn: async ([amount, multiplier, message]: Parameters<typeof mint>) =>
      mint(amount, multiplier, message, {
        onMintTxSubmitted: (hash) => dispatch('mintTxSubmitted', hash)
      }),
    onError: (error) => dispatch('txFailed', error),
    onSuccess: ([tokenId, , , hash]) => {
      dispatch('minted', [tokenId, hash]);
    }
  });

  const doApprove = async (val: MintProps) => {
    if (val.amount > 0) {
      await $approveMutation.mutateAsync([val.amount]);
    } else {
      throw new Error('Approval of 0 amount or token not found');
    }
  };

  const doMint = async (val: MintProps) => {
    await $mintMutation.mutateAsync([val.amount, val.multiplier, val.message ?? '']);
  };

  let action = doApprove;

  // soften cyclic dependency
  const setAction = (func: (val: MintProps) => Promise<void>) => (action = func);

  const { form, data } = createForm<MintProps>({
    async onSubmit(val) {
      try {
        await action(val);
      } catch (err) {
        log.error('Failed to create new subscripion', err);
        dispatch('txFailed', err);
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
        isDisabled={$approveMutation.isPending || $mintMutation.isPending}
      />
    </div>
  </form>
</div>
