<script lang="ts" context="module">
  import { z } from 'zod';

  export const EpochSizeSchema = z
    .union([z.literal('day'), z.literal('week'), z.literal('month')])
    .default('week');
  export type EpochSize = z.infer<typeof EpochSizeSchema>;
  const selectOptions: Array<{ value: EpochSize; label: string }> = [
    { value: 'day', label: '1 Day' },
    { value: 'week', label: '1 Week' },
    { value: 'month', label: '1 Month' }
  ];
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import type { SuperForm, FormPath } from 'sveltekit-superforms';

  import * as Form from '$lib/components/ui/form';
  import * as Select from '$lib/components/ui/select';

  export let name: U;
  export let label: string = 'Epoch Size';
  export let placeholder: string = 'Select the size of an Epoch';
  export let groupLabel: string = 'Durations';
  export let description: string = 'The epoch size determines the time interval that groups';
  export let form: SuperForm<T>;
  export let value: EpochSize;
  export let disabled = false;
  export let required = false;
</script>

<div>
  <Form.Field {form} {name}>
    <Form.Control let:attrs>
      <Form.Label>{label}</Form.Label>
      <Select.Root
        selected={selectOptions.find((o) => o.value === value)}
        onSelectedChange={(v) => v && (value = v.value)}
        {required}
        {disabled}
      >
        <Select.Trigger class="w-[180px]" {...attrs}>
          <Select.Value {placeholder} />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Label>{groupLabel}</Select.Label>
            {#each selectOptions as epochSize}
              <Select.Item value={epochSize.value} label={epochSize.label}
                >{epochSize.label}</Select.Item
              >
            {/each}
          </Select.Group>
        </Select.Content>
        <Select.Input name={attrs.name} bind:value />
      </Select.Root>
    </Form.Control>
    <Form.Description>{description}</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
</div>
