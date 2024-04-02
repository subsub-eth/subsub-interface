<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import type { FormPath, SuperForm } from 'sveltekit-superforms';
  import * as Form from '$lib/components/ui/form';
  import { Textarea } from '$lib/components/ui/textarea';

  export let name: U;
  export let label: string;
  export let description: string | undefined = undefined;
  export let form: SuperForm<T>;
  export let value: string | undefined;
  export let placeholder: string = '';
  export let disabled: boolean = false;
  export let required: boolean = false;

</script>

<div>
  <Form.Field {form} {name} {placeholder}>
    <Form.Control let:attrs>
      <Form.Label>{label}</Form.Label>
      <Textarea {...attrs} bind:value {placeholder} {required} {disabled} />
    </Form.Control>
    {#if description}
      <Form.Description>{description}</Form.Description>
    {/if}
    <Form.FieldErrors />
  </Form.Field>
</div>
