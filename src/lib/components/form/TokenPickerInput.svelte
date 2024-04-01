<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import type { Erc20Data, Erc20Token } from '$lib/web3/contracts/erc20';

  import type { Address } from '$lib/web3/contracts/common';

  import type { SuperForm, FormPath } from 'sveltekit-superforms';

  import * as Form from '$lib/components/ui/form';
  import TokenPicker from '$lib/components/TokenPicker.svelte';

  export let name: U;
  export let label: string = 'Token';
  export let description: string = 'Select a Token';
  export let form: SuperForm<T>;
  export let value: Address;
  /** load function to search token on a specific address */
  export let tokenByAddress: (address: Address) => Promise<Erc20Data>;
  /** list of known tokens to display for quick pick */
  export let knownTokens: Array<Erc20Token> = [];
  export let disabled = false;
  export let required = false;

  // TODO pass form name etc
</script>

<div>
  <Form.Field {form} {name}>
    <Form.Control let:attrs>
      <Form.Label>{label}</Form.Label>
      <TokenPicker bind:token={value} {tokenByAddress} {knownTokens} />
    </Form.Control>
    <Form.Description>{description}</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
</div>
