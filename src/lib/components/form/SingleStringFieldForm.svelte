<script lang="ts" module>
  export type FieldChangeEvents = {
    onTxSubmitted?: OnTx;
    onValueChanged?: OnTx;
  };
</script>

<script lang="ts">
  import Button from '../Button.svelte';
  import TextInput from './TextInput.svelte';
  import type { Hash } from '$lib/web3/contracts/common';
  import type { OnTx, TxFailedEvents } from '../common-events';
  import { z, ZodSchema } from 'zod';
  import { createMutation } from '@tanstack/svelte-query';
  import SuperDebug, { setError, superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import TextareaInput from './TextareaInput.svelte';

  type Events = FieldChangeEvents & TxFailedEvents;

  interface Props extends Events {
    formId: string;
    type?: 'input' | 'textarea';
    value: string | undefined;
    label: string;
    validatorSchema?: ZodSchema;
    handle: (s: string, events?: { onTxSubmitted?: (hash: Hash) => void }) => Promise<Hash>;
  }

  let {
    formId,
    type = 'input',
    value,
    label,
    validatorSchema = z.string().optional(),
    handle,
    onTxFailed,
    onTxSubmitted,
    onValueChanged
  }: Props = $props();

  const schema = z.object({ field: validatorSchema });

  const handleMutation = createMutation({
    mutationFn: async ([value]: Parameters<typeof handle>) =>
      handle(value, { onTxSubmitted: (hash) => onTxSubmitted?.(hash) }),
    onError: (error) => onTxFailed?.(error),
    onSuccess: (hash) => {
      onValueChanged?.(hash);
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
          const result = await $handleMutation.mutateAsync([val]);

          return result;
        } catch (err) {
          onTxFailed?.(err);
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
