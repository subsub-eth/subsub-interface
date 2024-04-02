<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
    import { log } from '$lib/logger';

  import type { FormPath, SuperForm } from 'sveltekit-superforms';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';

  export let name: U;
  export let label: string;
  export let description: string | undefined = undefined;
  export let placeholder: string | undefined = undefined;
  export let form: SuperForm<T>;
  export let value: number | undefined;
  export let disabled = false;
  export let required = false;
  export let step: string | number | undefined = undefined;
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;

  const setValue = (val: string | bigint) => {
    try {
      value = val ? Number(val) : 0;
    } catch {
      log.error('Unable to parse value', val);
      // pass broken value to form validation
      value = val as unknown as number;
    }
  };

  $: stringValue = value ? Number(value).toString() : '';
  $: {
    setValue(stringValue);
  }
</script>

<div>
  <Form.Field {form} {name} {placeholder}>
    <Form.Control let:attrs>
      <Form.Label>{label}</Form.Label>
      <Input
        class="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        {...attrs}
        bind:value={stringValue}
        type="number"
        {step}
        {required}
        {disabled}
        {min}
        {max}
        {placeholder}
      />
    </Form.Control>
    {#if description}
      <Form.Description>{description}</Form.Description>
    {/if}
    <Form.FieldErrors />
  </Form.Field>
</div>
