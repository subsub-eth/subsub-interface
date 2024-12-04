<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import type { FormPath, SuperForm } from 'sveltekit-superforms';
  import * as Form from '$lib/components/ui/form';
  import { Textarea } from '$lib/components/ui/textarea';

  interface Props<T extends Record<string, unknown>, U extends FormPath<T>> {
    name: U;
    label: string;
    description?: string | undefined;
    form: SuperForm<T>;
    value: string | undefined;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
  }

  let {
    name,
    label,
    description = undefined,
    form,
    value = $bindable(),
    placeholder = '',
    disabled = false,
    required = false
  }: Props<T, U> = $props();
</script>

<div>
  <Form.Field {form} {name}>
    <Form.Control>
      {#snippet children({ attrs })}
        <Form.Label>{label}</Form.Label>
        <Textarea {...attrs} bind:value {placeholder} {required} {disabled} />
      {/snippet}
    </Form.Control>
    {#if description}
      <Form.Description>{description}</Form.Description>
    {/if}
    <Form.FieldErrors />
  </Form.Field>
</div>
