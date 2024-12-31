<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import { log } from '$lib/logger';

  import { formatUnits, parseUnits } from '$lib/web3/helpers';

  import type { SuperForm, FormPath } from 'sveltekit-superforms';

  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { isValidNumeric } from '$lib/helpers';

  interface Props<T extends Record<string, unknown>, U extends FormPath<T>> {
    name: U;
    label?: string;
    placeholder?: string;
    description?: string;
    form: SuperForm<T>;
    value: bigint | undefined;
    decimals?: number;
    disabled?: boolean;
    required?: boolean;
  }

  let {
    name,
    label = 'Amount',
    placeholder = '10.01',
    description = '',
    form,
    value = $bindable(),
    decimals = 18,
    disabled = false,
    required = false
    // eslint-disable-next-line no-undef
  }: Props<T, U> = $props();

  const initValue = value === undefined ? '' : formatUnits(value, decimals);

  let displayValue = {
    // initialize with empty string if no value set
    internalValue: initValue,

    get value() {
      // compare exposed value with internal value and if exposed value is different, then renew and return this.internalValue
      const parsed = parseUnits(this.internalValue, decimals);
      if ((value !== undefined && value != parsed) || (value === undefined && parsed != 0n)) {
        this.internalValue = formatUnits(BigInt(value ?? 0), decimals);
      }
      return this.internalValue;
    },
    set value(v) {
      // check if string is somewhat a valid number
      if (!isValidNumeric(v, decimals)) {
        return;
      }
      this.internalValue = v;
      try {
        value = parseUnits(v, decimals);
      } catch (err) {
        log.error(`Failed to convert value to valid bigint`, v, err);
        value = 0n;
      }
    }
  };
</script>

<div>
  <Form.Field {form} {name}>
    <Form.Control>
      {#snippet children({ attrs })}
        <Form.Label>{label}</Form.Label>
        <Input
          class="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          {...attrs}
          bind:value={displayValue.value}
          {placeholder}
          {disabled}
          {required}
          type="text"
        />
      {/snippet}
    </Form.Control>
    {#if description}
      <Form.Description>{description}</Form.Description>
    {/if}
    <Form.FieldErrors />
  </Form.Field>
</div>
