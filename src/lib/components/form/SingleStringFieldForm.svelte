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
  import { createEventDispatcher, type EventDispatcher } from 'svelte';
  import type { Hash } from '$lib/web3/contracts/common';
  import type { TxFailedEvents } from '../common-events';
  import { validator } from '@felte/validator-zod';
  import { reporter } from '@felte/reporter-svelte';
  import { z, ZodSchema } from 'zod';

  export let value: string | undefined;
  export let label: string;
  export let validatorSchema: ZodSchema = z.string().optional();

  export let handle: (s: string, dispatch: EventDispatcher<FieldChangeEvents>) => Promise<string>;

  const dispatch = createEventDispatcher<FieldChangeEvents & TxFailedEvents>();

  const { form, data, isDirty, reset } = createForm<{ field: string | undefined }>({
    onSubmit: async (values) => {
      console.log('submit triggered');

      try {
        await handle(values.field + '', dispatch);
      } catch (err) {
        dispatch('txFailed', err);
      }
    },
    initialValues: {
      field: value
    },

    extend: [validator({ schema: z.object({ field: validatorSchema }) }), reporter]
  });
</script>

<div>
  <form use:form>
    <TextInput name="field" {label} id={label.toLowerCase().replaceAll(/\s/g, '')} />
    {#if $isDirty}
      <Button label="apply" type="submit" />
      <Button label="reset" on:click={() => reset()} />
    {/if}
  </form>
</div>
