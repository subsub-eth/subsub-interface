<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import { log } from '$lib/logger';

  import type { FormPath, SuperForm } from 'sveltekit-superforms';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';

  interface Props<T extends Record<string, unknown>, U extends FormPath<T>> {
    name: U;
    label: string;
    description?: string | undefined;
    placeholder?: string | undefined;
    form: SuperForm<T>;
    value: number | undefined;
    disabled?: boolean;
    required?: boolean;
    step?: string | number | undefined;
    min?: number | undefined;
    max?: number | undefined;
  }

  let {
    name,
    label,
    description = undefined,
    placeholder = undefined,
    form,
    value = $bindable(),
    disabled = false,
    required = false,
    step = undefined,
    min = undefined,
    max = undefined
    // eslint-disable-next-line no-undef
  }: Props<T, U> = $props();

  const setValue = (val: string | bigint) => {
    try {
      value = val ? Number(val) : 0;
    } catch {
      log.error('Unable to parse value', val);
      // pass broken value to form validation
      value = val as unknown as number;
    }
  };

  let stringValue = $state(value ? Number(value).toString() : '');

  $effect(() => {
    setValue(stringValue);
  });
</script>

<div>
  <Form.Field {form} {name}>
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>{label}</Form.Label>
        <Input
          class="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          {...props}
          bind:value={stringValue}
          type="number"
          {step}
          {required}
          {disabled}
          {min}
          {max}
          {placeholder}
        />
      {/snippet}
    </Form.Control>
    {#if description}
      <Form.Description>{description}</Form.Description>
    {/if}
    <Form.FieldErrors />
  </Form.Field>
</div>
