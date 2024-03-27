<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import type { FormPath, SuperForm } from 'sveltekit-superforms';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';

  export let name: U;
  export let label: string;
  export let form: SuperForm<T>;
  export let value: unknown;
  export let id: string = '';
  export let placeholder: string = '';
  export let disabled: boolean = false;
  export let required: boolean = false;
  export let minLength: number = 0;
  export let maxLength: number = 0;

  if (!id) {
    id = 'input-' + name;
  }

  let opts: any = {};
  $: {
    opts = {};
    if (placeholder) opts.placeholder = placeholder;
    if (disabled) opts.disabled = disabled;
    if (required) opts.required = required;
    if (minLength) opts.minLength = minLength;
    if (maxLength) opts.maxLength = maxLength;
  }
</script>

<div>
  <Form.Field {form} {name}>
    <Form.Control let:attrs>
      <Form.Label>{label}</Form.Label>
      <Input {...attrs} {...opts} bind:value={value} />
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
</div>
