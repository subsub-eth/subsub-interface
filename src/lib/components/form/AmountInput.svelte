<script lang="ts" context="module">
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import { log } from '$lib/logger';

  import { formatUnits, parseUnits } from 'ethers';

  import type { SuperForm, FormPath } from 'sveltekit-superforms';

  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';

  export let name: U;
  export let label: string = 'Amount';
  export let placeholder: string = '10.01';
  export let description: string = '';
  export let form: SuperForm<T>;
  export let value: bigint | undefined;
  export let decimals: number = 18;
  export let disabled = false;
  export let required = false;

  let displayValue: string;

  const setDisplayValue = (val: bigint | undefined) =>
    (displayValue = val ? formatUnits(val, decimals) : '');

  const setValue = (val: string) => {
    // in case of error, pass bad value, that's zod's problem
    try {
      if (val) {
        value = parseUnits(val, decimals);
      } else {
        value = undefined as unknown as bigint;
      }
    } catch (err) {
      log.error(`Failed to convert value to valid bigint`, val);
      value = 0n;
    }
  };

  // create reactive dependencies while hiding cyclic dependencies in funcs
  $: setDisplayValue(value);
  $: setValue(displayValue);
</script>

<div>
  <Form.Field {form} {name}>
    <Form.Control let:attrs>
      <Form.Label>{label}</Form.Label>
      <Input
        class="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        {...attrs}
        bind:value={displayValue}
        {placeholder}
        {disabled}
        {required}
        type="number"
        min="0"
        step={formatUnits(1n, decimals)}
      />
    </Form.Control>
    {#if description}
      <Form.Description>{description}</Form.Description>
    {/if}
    <Form.FieldErrors />
  </Form.Field>
</div>
