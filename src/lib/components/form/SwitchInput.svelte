<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import { Switch } from '$lib/components/ui/switch';

  import type { FormPath, SuperForm } from 'sveltekit-superforms';
  import * as Form from '$lib/components/ui/form';

  export let name: U;
  export let label: string;
  export let description: string | undefined = undefined;
  export let form: SuperForm<T>;
  export let value: boolean;
  export let disabled: boolean = false;
  export let required: boolean = false;
</script>

<div>
  <Form.Field {form} {name}>
    <Form.Control let:attrs>
      <Form.Label>{label}</Form.Label>
      <Switch {...attrs} bind:checked={value} {required} {disabled} />
    </Form.Control>
    {#if description}
      <Form.Description>{description}</Form.Description>
    {/if}
    <Form.FieldErrors />
  </Form.Field>
</div>
