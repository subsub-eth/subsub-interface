<script lang="ts" context="module">
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
  import { createEventDispatcher } from 'svelte';
  import { type FlagsChangeContractEvents } from './subscription-events';
  import { createMutation } from '@tanstack/svelte-query';
  import { z } from 'zod';
  import SuperDebug, { superForm, setError } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import Button from '$lib/components/Button.svelte';
  import SwitchInput from '$lib/components/form/SwitchInput.svelte';

  export let data: SubscriptionContractData;

  export let formId: string;
  export let setFlags: UpdateFlags;

  const dispatch = createEventDispatcher<FlagsChangeContractEvents>();

  const updateMutation = createMutation({
    mutationFn: async ([flags]: Parameters<typeof setFlags>) =>
      setFlags(flags, {
        onFlagsTxSubmitted: (hash) => dispatch('flagsTxSubmitted', hash)
      }),
    onError: (error) => dispatch('txFailed', error),
    onSuccess: ( hash) => {
      dispatch('flagsChanged', hash);
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
        dispatch('txFailed', err);
        throw err;
      }
    }
  });

  const { form: formData, errors, enhance, reset } = form;

  $: {
    // reset the form to the new data that is being passed down
    reset({ data: fromData(data) });
  }
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
