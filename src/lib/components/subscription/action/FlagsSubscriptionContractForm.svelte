<script lang="ts" module>
  const FlagsSchema = z.object({
    minting: z.boolean(),
    renewal: z.boolean(),
    tipping: z.boolean()
  });

  type Flags = z.infer<typeof FlagsSchema>;
</script>

<script lang="ts">
  import {
    FLAG_MINTING_PAUSED,
    FLAG_RENEWAL_PAUSED,
    FLAG_TIPPING_PAUSED,
    createFlags,
    type SubscriptionContractData,
    type SubscriptionFlag,
    type UpdateFlags
  } from '$lib/web3/contracts/subscription';
  import { type FlagsChangeContractEvents } from './subscription-events';
  import { createMutation } from '@tanstack/svelte-query';
  import { z } from 'zod';
  import SuperDebug, { superForm, setError } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import Button from '$lib/components/Button.svelte';
  import SwitchInput from '$lib/components/form/SwitchInput.svelte';

  interface Props extends FlagsChangeContractEvents {
    data: SubscriptionContractData;
    formId: string;
    setFlags: UpdateFlags;
  }

  let { data, formId, setFlags, onFlagsTxSubmitted, onFlagsChanged, onTxFailed }: Props = $props();

  const updateMutation = createMutation({
    mutationFn: async ([flags]: Parameters<typeof setFlags>) =>
      setFlags(flags, {
        onFlagsTxSubmitted: (hash) => onFlagsTxSubmitted?.(hash)
      }),
    onError: (error) => onTxFailed?.(error),
    onSuccess: (hash) => {
      onFlagsChanged?.(hash);
    }
  });

  const fromData = (data: SubscriptionContractData): Flags => ({
    minting: !data.mintingPaused,
    renewal: !data.renewalPaused,
    tipping: !data.tippingPaused
  });

  const form = superForm(fromData(data), {
    id: formId,
    SPA: true,
    dataType: 'json',
    validators: zod(FlagsSchema),
    resetForm: false, // necessary to prevent short flashes of old data
    onUpdate: async ({ form }) => {
      if (!form.valid) {
        setError(form, 'form invaluid');
        return;
      }

      const val = form.data;

      let flags: Array<SubscriptionFlag> = [];
      !val.minting && flags.push(FLAG_MINTING_PAUSED);
      !val.renewal && flags.push(FLAG_RENEWAL_PAUSED);
      !val.tipping && flags.push(FLAG_TIPPING_PAUSED);

      const flagsValue = createFlags(flags);

      try {
        const result = $updateMutation.mutateAsync([flagsValue]);
        return result;
      } catch (err) {
        onTxFailed?.(err);
        throw err;
      }
    }
  });

  const { form: formData, errors, enhance } = form;

  // run(() => {
  //   // reset the form to the new data that is being passed down
  //   reset({ data: fromData(data) });
  // });
</script>

<div>
  <form method="POST" use:enhance>
    <SwitchInput
      {form}
      name="minting"
      label="Minting"
      description="Pause and unpause minting of new subscriptions"
      bind:value={$formData.minting}
    />
    <SwitchInput
      {form}
      name="renewal"
      label="Renewal"
      description="Pause and unpause renewing of existing subscriptions"
      bind:value={$formData.renewal}
    />
    <SwitchInput
      {form}
      name="tipping"
      label="Tipping"
      description="Pause and unpause receiving of tips on this subscription plan"
      bind:value={$formData.tipping}
    />
    <Button label="apply" type="submit" isLoading={$updateMutation.isPending} />
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
