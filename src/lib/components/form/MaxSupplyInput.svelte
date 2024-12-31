<script lang="ts" module>
  const MAX = maxUint256;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import { Label } from '../ui/label';

  import { log } from '$lib/logger';

  import { maxUint256 } from '$lib/web3/helpers';

  import type { SuperForm, FormPath } from 'sveltekit-superforms';

  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Checkbox } from '$lib/components/ui/checkbox';

  interface Props<T extends Record<string, unknown>, U extends FormPath<T>> {
    name: U;
    label?: string;
    placeholder?: string;
    description?: string;
    form: SuperForm<T>;
    value: bigint | undefined;
    unlimitedValue?: bigint;
    disabled?: boolean;
    required?: boolean;
  }

  let {
    name,
    label = 'Maximum Supply',
    placeholder = '10000',
    description = 'Maximum supply of subscription that can be created',
    form,
    value = $bindable(),
    unlimitedValue = MAX,
    disabled = false,
    required = false
    // eslint-disable-next-line no-undef
  }: Props<T, U> = $props();

  let inputDisabled = $state(false);
  let isUnlimited = $state(false);
  let stringValue = $state(value ? BigInt(value).toString() : '');

  const setValue = (val: string | bigint) => {
    try {
      value = val ? BigInt(val) : 0n;
    } catch {
      log.error('Unable to parse value', val);
      // pass broken value to form validation
      value = val as unknown as bigint;
    }
  };

  $effect(() => {
    inputDisabled = isUnlimited;
    // set max or reset
    setValue(isUnlimited ? unlimitedValue : stringValue);
  });
</script>

<div>
  <Form.Field {form} {name}>
    <Form.Control>
      {#snippet children({ attrs })}
        <Form.Label>{label}</Form.Label>
        <Checkbox id={`${name}-unlimited`} bind:checked={isUnlimited} {disabled} />
        <Label for={`${name}-unlimited`}>Unlimited</Label>
        <Input
          class="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          {...attrs}
          bind:value={stringValue}
          {placeholder}
          disabled={inputDisabled || disabled}
          {required}
          type="number"
          min="0"
          step="1"
        />
      {/snippet}
    </Form.Control>
    <Form.Description>{description}</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
</div>
