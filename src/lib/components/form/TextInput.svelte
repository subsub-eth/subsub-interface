<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import type { FormPath, SuperForm } from 'sveltekit-superforms';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';

  interface Props<T extends Record<string, unknown>, U extends FormPath<T>> {
    name: U;
    label: string;
    description?: string | undefined;
    form: SuperForm<T>;
    value: unknown;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    minlength?: number | undefined;
    maxlength?: number | undefined;
  }

  let {
    name,
    label,
    description = undefined,
    form,
    value = $bindable(),
    placeholder = '',
    disabled = false,
    required = false,
    minlength = undefined,
    maxlength = undefined
    // eslint-disable-next-line no-undef
  }: Props<T, U> = $props();
</script>

<div>
  <Form.Field {form} {name}>
    <Form.Control>
      {#snippet children({ attrs })}
        <Form.Label>{label}</Form.Label>
        <Input {...attrs} bind:value {placeholder} {required} {disabled} {minlength} {maxlength} />
      {/snippet}
    </Form.Control>
    {#if description}
      <Form.Description>{description}</Form.Description>
    {/if}
    <Form.FieldErrors />
  </Form.Field>
</div>
