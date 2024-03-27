<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import type { FormPath, SuperForm } from 'sveltekit-superforms';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';

  export let name: U;
  export let label: string;
  export let form: SuperForm<T>;
  export let value: unknown;
  export let disabled = false;
  export let required = false;

  let opts: any = {};
  $: {
    opts = {};
    if (disabled) opts.disabled = disabled;
    if (required) opts.required = required;
    if (value !== null) opts.value = value;
  }
</script>

<div>
  <Form.Field {form} {name}>
    <Form.Control let:attrs>
      <Form.Label>{label}</Form.Label>
      <Input {...attrs} {...opts} bind:value={value} type="number"/>
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
</div>
