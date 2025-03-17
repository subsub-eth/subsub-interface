<script lang="ts" module>
  const amountSchema = z.bigint().min(0n, 'Amount must be larger or equal to 0');

  export const ApprovalSchema = z.object({
    amount: amountSchema
  });

  export const MintSchema = z.object({
    amount: amountSchema.optional(),
    message: z.string().optional(),
    multiplier: z
      .number()
      .multipleOf(0.01)
      .min(1, 'Multiplier must be larger or equal to 1')
      .max(1_000, 'Multiplier must be less or equal to 1,000')
      .default(1)
  });

  export type MintProps = z.infer<typeof MintSchema>;
</script>

<script lang="ts">
  import NumberInput from '../../form/NumberInput.svelte';
  import TextInput from '../../form/TextInput.svelte';
  import { type MintFunc } from '$lib/web3/contracts/subscription';
  import type { MintSubscriptionEvents } from './subscription-events';
  import Button from '$lib/components/Button.svelte';
  import type { ApproveFunc } from '$lib/web3/contracts/erc20';
  import { createMutation } from '@tanstack/svelte-query';
  import { log } from '$lib/logger';
  import SuperDebug, { defaults, setError, superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { z } from 'zod';
  import AmountInput from '$lib/components/form/AmountInput.svelte';

  interface Props extends MintSubscriptionEvents {
    // TODO handle approval/permit, permit2?
    formId: string;
    allowance: bigint;
    balance: bigint;
    mint: MintFunc;
    approve: ApproveFunc;
  }

  let {
    formId,
    allowance,
    balance,
    mint,
    approve,
    onTxFailed,
    onApprovalTxSubmitted,
    onMinted,
    onApproved,
    onMintTxSubmitted
  }: Props = $props();

  const approveMutation = createMutation({
    mutationFn: async ([amount]: Parameters<typeof approve>) =>
      approve(amount, { onApprovalTxSubmitted: (hash) => onApprovalTxSubmitted?.(hash) }),
    onError: (error) => onTxFailed?.(error),
    onSuccess: ([amount, tx]) => {
      onApproved?.(amount, tx);
    }
  });

  const mintMutation = createMutation({
    mutationFn: async ([amount, multiplier, message]: Parameters<typeof mint>) =>
      mint(amount, multiplier, message, {
        onMintTxSubmitted: (hash) => onMintTxSubmitted?.(hash)
      }),
    onError: (error) => onTxFailed?.(error),
    onSuccess: ([tokenId, , , hash]) => {
      onMinted?.(tokenId, hash);
    }
  });

  const doApprove = async (val: MintProps) => {
    if (val.amount && val.amount > 0) {
      await $approveMutation.mutateAsync([val.amount!]);
    } else {
      throw new Error('Approval of 0 amount or token not found');
    }
  };

  const doMint = async (val: MintProps) => {
    await $mintMutation.mutateAsync([val.amount ?? 0n, val.multiplier!, val.message ?? '']);
  };

  let action = doApprove;

  // soften cyclic dependency
  const setAction = (func: (val: MintProps) => Promise<void>) => (action = func);

  const form = superForm(defaults(zod(MintSchema)), {
    id: formId,
    SPA: true,
    dataType: 'json',
    resetForm: false,
    validators: zod(MintSchema),
    onUpdate: async ({ form }) => {
      if (!form.valid) {
        setError(form, 'invalid');
        return;
      }

      const val = form.data;
      const multiplier = Math.floor((val.multiplier ?? 0) * 100);

      try {
        await action({ ...val, multiplier: multiplier });
      } catch (err) {
        log.error('Failed to create new subscripion', err);
        onTxFailed?.(err);
      }
    }
  });

  const { form: formData, errors, enhance, options } = $state(form);

  let needsApproval = $derived(allowance < ($formData.amount ?? 0n));

  $effect(() => {
    if (needsApproval) {
      options.validators = zod(ApprovalSchema);
      setAction(doApprove);
    } else {
      options.validators = zod(MintSchema);
      setAction(doMint);
    }
  });
</script>

<div>
  <form method="POST" use:enhance>
    <div>current balance: {balance}</div>
    <AmountInput {form} name="amount" label="Amount" bind:value={$formData.amount} />
    <NumberInput
      {form}
      name="multiplier"
      label="Multiplier"
      bind:value={$formData.multiplier}
      disabled={needsApproval}
      required
      min={1}
      max={1_000}
      step={0.01}
    />
    <TextInput
      {form}
      bind:value={$formData.message}
      name="message"
      label="Message"
      disabled={needsApproval}
    />

    <div>
      <Button type="submit" disabled={$approveMutation.isPending || $mintMutation.isPending}
        >{needsApproval ? 'Approve' : 'Create'}
      </Button>
    </div>
    <div>
      {#if $errors._errors}
        {#each $errors._errors as err (err)}
          {err}
        {/each}
      {/if}
    </div>
  </form>
  <SuperDebug data={formData} />
</div>
