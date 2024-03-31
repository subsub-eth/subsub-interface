<script lang="ts" context="module">
  import { z } from 'zod';

</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
    import type { Address } from '$lib/web3/contracts/common';

  import type { SuperForm, FormPath } from 'sveltekit-superforms';

  import * as Form from '$lib/components/ui/form';
  import * as Select from '$lib/components/ui/select';

  export let name: U;
  export let label: string = 'Epoch Size';
  export let placeholder: string = 'Select the size of an Epoch';
  export let groupLabel: string = 'Durations';
  export let description: string = 'The epoch size determines the time interval that groups';
  export let form: SuperForm<T>;
  export let value: Address;
  export let disabled = false;
  export let required = false;
</script>

<div>
  <Form.Field {form} {name}>
    <Form.Control let:attrs>
      <Form.Label>{label}</Form.Label>
      
    </Form.Control>
    <Form.Description>{description}</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
</div>
