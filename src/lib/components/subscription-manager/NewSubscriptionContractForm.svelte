<script lang="ts">
  import { createForm } from 'felte';
  import TextInput from '../form/TextInput.svelte';
  import {
    SubscriptionContractPropsSchema,
    type SubscriptionContractProps
  } from '$lib/web3/contracts/subscription-manager';
  import { validator } from '@felte/validator-zod';
  import { reporter } from '@felte/reporter-svelte';

  const { form } = createForm<SubscriptionContractProps>({
    extend: [validator({ schema: SubscriptionContractPropsSchema }), reporter]
  });

  let formDisabled = false;
</script>

<div>
  <form use:form>
    <fieldset>
      <legend>Name</legend>
      <TextInput name="name" label="Name" required />
      <TextInput name="symbol" label="Symbol" required minLength={2} maxLength={12} />
    </fieldset>
    <fieldset>
      <legend>Metadata</legend>
    </fieldset>
    <fieldset>
      <legend>Subscription Config</legend>
    </fieldset>
    <div>
      <button type="submit" disabled={formDisabled}>create</button>
    </div>
  </form>
</div>
