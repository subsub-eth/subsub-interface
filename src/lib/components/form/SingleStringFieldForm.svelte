<script lang="ts" context="module">
  export type FieldChangeEvents = {
    txSubmitted: Hash,
    valueChanged: [string, Hash]
  }
</script>
<script lang="ts">
  import { createForm } from 'felte';
  import Button from '../Button.svelte';
  import TextInput from './TextInput.svelte';
    import { createEventDispatcher, type EventDispatcher } from 'svelte';
    import type { Hash } from '$lib/web3/contracts/common';
    import type { TxFailedEvents } from '../common-events';

  export let value: string | undefined;
  export let label: string;

  export let handle: (s: string, dispatch: EventDispatcher<FieldChangeEvents>) => Promise<string>;

  const dispatch = createEventDispatcher<FieldChangeEvents & TxFailedEvents>();

  const { form, data, isDirty, reset } = createForm<{ field: string | undefined }>({
    onSubmit: async (values) => {
      console.log('submit triggered');

      try {
        await handle(values.field + "", dispatch);
      } catch (err) {
        dispatch('txFailed', err);
      }

    },
    initialValues: {
      field: value
    }
  });
</script>

<div>
  <form use:form>
    <TextInput name="field" label={label} id={label.toLowerCase().replaceAll(/\s/g, '')} />
    {#if $isDirty}
      <Button label="apply" type="submit" />
      <Button label="reset" on:click={() => reset()} />
    {/if}
  </form>
</div>
