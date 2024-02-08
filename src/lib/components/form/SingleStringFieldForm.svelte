<script lang="ts" context="module">
  export type FieldChangeEvents = {
    txSubmitted: Hash;
    valueChanged: [string, Hash];
  };
</script>

<script lang="ts">
  import { createForm } from 'felte';
  import Button from '../Button.svelte';
  import TextInput from './TextInput.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { Hash } from '$lib/web3/contracts/common';
  import type { TxFailedEvents } from '../common-events';
  import { validator } from '@felte/validator-zod';
  import { reporter } from '@felte/reporter-svelte';
  import { z, ZodSchema } from 'zod';
  import { createMutation } from '@tanstack/svelte-query';

  export let value: string | undefined;
  export let label: string;
  export let validatorSchema: ZodSchema = z.string().optional();

  export let handle: (
    s: string,
    events?: { onTxSubmitted?: (hash: Hash) => void }
  ) => Promise<[string, Hash]>;

  const dispatch = createEventDispatcher<FieldChangeEvents & TxFailedEvents>();

  const handleMutation = createMutation({
    mutationFn: async ([value]: Parameters<typeof handle>) =>
      handle(value, { onTxSubmitted: (hash) => dispatch('txSubmitted', hash) }),
    onError: (error) => dispatch('txFailed', error),
    onSuccess: ([value, hash]) => {
      dispatch('valueChanged', [value, hash]);
    }
  });

  const { form, isDirty, reset, setInitialValues } = createForm<{
    field: string | undefined;
  }>({
    onSubmit: async (values) => {
      try {
        const val = values.field + '';
        const result = await $handleMutation.mutateAsync([
          val,
          { onTxSubmitted: (hash) => dispatch('txSubmitted', hash) }
        ]);

        // re-initialize the form
        setInitialValues({
          field: val
        });
        reset();
        return result;
      } catch (err) {
        dispatch('txFailed', err);
        throw err;
      }
    },
    initialValues: {
      field: value
    },

    extend: [validator({ schema: z.object({ field: validatorSchema }) }), reporter]
  });

  const id = label.toLowerCase().replaceAll(/\s/g, '');
</script>

<div>
  <form use:form>
    <TextInput name="field" {label} {id} />
    {#if $isDirty}
      <Button label="apply" type="submit" isLoading={$handleMutation.isPending} />
      <Button label="reset" on:click={() => reset()} />
    {/if}
  </form>
</div>
