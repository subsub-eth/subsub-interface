<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import type { Erc20Data, Erc20Token } from '$lib/web3/contracts/erc20';

  import type { Address } from '$lib/web3/contracts/common';

  import type { SuperForm, FormPath } from 'sveltekit-superforms';

  import * as Form from '$lib/components/ui/form';
  import TokenPicker from '$lib/components/TokenPicker.svelte';

  interface Props<T extends Record<string, unknown>, U extends FormPath<T>> {
    name: U;
    label?: string;
    description?: string;
    form: SuperForm<T>;
    value: Address;
    /** load function to search token on a specific address */
    tokenByAddress: (address: Address) => Promise<Erc20Data>;
    /** list of known tokens to display for quick pick */
    knownTokens?: Array<Erc20Token>;
    disabled?: boolean;
    required?: boolean; // TODO pass form name etc
  }

  let {
    name,
    label = 'Token',
    description = 'Select a Token',
    form,
    value = $bindable(),
    tokenByAddress,
    knownTokens = [],
    disabled = false
  }: Props<T, U> = $props();
</script>

<div>
  <Form.Field {form} {name}>
    <Form.Control>
      <Form.Label>{label}</Form.Label>
      <TokenPicker bind:token={value} {tokenByAddress} {knownTokens} {disabled} />
    </Form.Control>
    <Form.Description>{description}</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
</div>
