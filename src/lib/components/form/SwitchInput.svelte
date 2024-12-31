<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import { Switch } from '$lib/components/ui/switch';

  import type { FormPath, SuperForm } from 'sveltekit-superforms';
  import * as Form from '$lib/components/ui/form';

  interface Props<T extends Record<string, unknown>, U extends FormPath<T>> {
    name: U;
    label: string;
    description?: string | undefined;
    form: SuperForm<T>;
    value: boolean;
    disabled?: boolean;
    required?: boolean;
  }

  let {
    name,
    label,
    description = undefined,
    form,
    value = $bindable(),
    disabled = false,
    required = false
    // eslint-disable-next-line no-undef
  }: Props<T, U> = $props();
</script>

<div>
  <Form.Field {form} {name}>
    <Form.Control>
      {#snippet children({ attrs })}
        <Form.Label>{label}</Form.Label>
        <Switch {...attrs} bind:checked={value} {required} {disabled} />
      {/snippet}
    </Form.Control>
    {#if description}
      <Form.Description>{description}</Form.Description>
    {/if}
    <Form.FieldErrors />
  </Form.Field>
</div>
