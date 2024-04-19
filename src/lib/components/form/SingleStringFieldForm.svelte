<script lang="ts" context="module">
  export type FieldChangeEvents = {
    txSubmitted: Hash;
    valueChanged: [string, Hash];
  };
</script>

<script lang="ts">
  import Button from '../Button.svelte';
  import TextInput from './TextInput.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { Hash } from '$lib/web3/contracts/common';
  import type { TxFailedEvents } from '../common-events';
  import { z, ZodSchema } from 'zod';
  import { createMutation } from '@tanstack/svelte-query';
  import SuperDebug, { defaults, setError, superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import TextareaInput from './TextareaInput.svelte';

  export let formId: string;
  export let type: 'input' | 'textarea' = 'input';
  export let value: string | undefined;
  export let label: string;
  export let validatorSchema: ZodSchema = z.string().optional();

  export let handle: (
    s: string,
    events?: { onTxSubmitted?: (hash: Hash) => void }
  ) => Promise<[string, Hash]>;

  const dispatch = createEventDispatcher<FieldChangeEvents & TxFailedEvents>();
  const schema = z.object({ field: validatorSchema });

  const handleMutation = createMutation({
    mutationFn: async ([value]: Parameters<typeof handle>) =>
      handle(value, { onTxSubmitted: (hash) => dispatch('txSubmitted', hash) }),
    onError: (error) => dispatch('txFailed', error),
    onSuccess: ([value, hash]) => {
      dispatch('valueChanged', [value, hash]);
    }
  });

  const form = superForm(
    { field: value },
    {
      id: formId,
      SPA: true,
      dataType: 'json',
      resetForm: false,
      validators: zod(schema),
      onUpdate: async ({ form }) => {
        if (!form.valid) {
          setError(form, 'invalid');
          return;
        }
        const val = form.data.field ?? '';
        try {
          const result = await $handleMutation.mutateAsync([
            val
          ]);

          return result;
        } catch (err) {
          dispatch('txFailed', err);
          throw err;
        }
      }
    }
  );

  const { form: formData, errors, enhance, tainted, isTainted, reset } = form;
</script>

<div>
  <form method="POST" use:enhance>
    {#if type === 'textarea'}
      <TextareaInput {form} name="field" {label} bind:value={$formData.field} />
    {:else}
      <TextInput {form} name="field" {label} bind:value={$formData.field} />
    {/if}
    {#if isTainted($tainted?.field)}
      <Button label="apply" type="submit" isLoading={$handleMutation.isPending} />
      <Button label="reset" on:click={() => reset()} />
    {/if}
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
