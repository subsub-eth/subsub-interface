<script lang="ts" context="module">
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

  export let name: U;
  export let label: string = 'Maximum Supply';
  export let placeholder: string = '10000';
  export let description: string = 'Maximum supply of subscription that can be created';
  export let form: SuperForm<T>;
  export let value: bigint | undefined;
  export let unlimitedValue: bigint = MAX;
  export let disabled = false;
  export let required = false;

  let inputDisabled = false;
  let isUnlimited = false;
  let stringValue = value ? BigInt(value).toString() : '';

  const setValue = (val: string | bigint) => {
    try {
      value = val ? BigInt(val) : 0n;
    } catch {
      log.error('Unable to parse value', val);
      // pass broken value to form validation
      value = val as unknown as bigint;
    }
  };

  $: {
    inputDisabled = isUnlimited;
    // set max or reset
    setValue(isUnlimited ? unlimitedValue : stringValue);
  }

  $: {
    setValue(stringValue);
  }
</script>

<div>
  <Form.Field {form} {name}>
    <Form.Control let:attrs>
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
    </Form.Control>
    <Form.Description>{description}</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
</div>
