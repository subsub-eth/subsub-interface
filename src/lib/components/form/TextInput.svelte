<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import type { FormPath, SuperForm } from 'sveltekit-superforms';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';

  export let name: U;
  export let label: string;
  export let description: string | undefined = undefined;
  export let form: SuperForm<T>;
  export let value: unknown;
  export let id: string = '';
  export let placeholder: string = '';
  export let disabled: boolean = false;
  export let required: boolean = false;
  export let minlength: number | undefined = undefined;
  export let maxlength: number | undefined = undefined;

  if (!id) {
    id = 'input-' + name;
  }
</script>

<div>
  <Form.Field {form} {name} {placeholder}>
    <Form.Control let:attrs>
      <Form.Label>{label}</Form.Label>
      <Input {...attrs} bind:value {placeholder} {required} {disabled} {minlength} {maxlength} />
    </Form.Control>
    {#if description}
      <Form.Description>{description}</Form.Description>
    {/if}
    <Form.FieldErrors />
  </Form.Field>
</div>
