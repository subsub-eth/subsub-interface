<script lang="ts" context="module">
  import { z } from 'zod';

  const month = 60n * 60n * 24n * 30n;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import { log } from '$lib/logger';

  import { formatUnits, parseUnits } from 'ethers';

  import type { SuperForm, FormPath } from 'sveltekit-superforms';

  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';

  export let name: U;
  export let label: string = 'Rate';
  export let placeholder: string = '10.01';
  export let description: string = 'The price of a subscription per month';
  export let form: SuperForm<T>;
  export let value: bigint | undefined;
  export let rateDecimals: number = 18;
  export let disabled = false;
  export let required = false;

  let displayValue: string;

  const setDisplayValue = (val: bigint | undefined) =>
    (displayValue = val ? formatUnits(val, rateDecimals) : '');

  const setValue = (val: string) => {
    // in case of error, pass bad value, that's zod's problem
    try {
      if (val) {
        const monthly = parseUnits(val, rateDecimals);
        value = monthly / month;
      } else {
        value = val as unknown as bigint;
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
        step={formatUnits(1n, rateDecimals)}
      />
    </Form.Control>
    <Form.Description>{description}</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
</div>
