<script lang="ts" module>
  const month = 60n * 60n * 24n * 30n;
</script>

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
    rateDecimals?: number;
    disabled?: boolean;
    required?: boolean;
  }

  let {
    name,
    label = 'Rate',
    placeholder = '10.01',
    description = 'The price of a subscription per month',
    form,
    value = $bindable(),
    rateDecimals = 18,
    disabled = false,
    required = false
    // eslint-disable-next-line no-undef
  }: Props<T, U> = $props();

  const initValue = formatUnits(BigInt(value ?? 0), rateDecimals);

  let displayValue = {
    // initialize with empty string if no value set
    internalValue: initValue === '0' ? '' : initValue,

    get value() {
      return this.internalValue;
    },
    set value(v) {
      // check if string is somewhat a valid number
      if (!isValidNumeric(v, rateDecimals)) {
        return;
      }
      this.internalValue = v;
      try {
        const monthly = parseUnits(v ?? 0, rateDecimals);
        value = monthly / month;
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
        rate per second: ${value}
      {/snippet}
    </Form.Control>
    {#if description}
      <Form.Description>{description}</Form.Description>
    {/if}
    <Form.FieldErrors />
  </Form.Field>
</div>
