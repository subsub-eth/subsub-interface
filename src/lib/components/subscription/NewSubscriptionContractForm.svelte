<script lang="ts" context="module">
  const SubscriptionContractSchema = z.object({
    name: TokenNameSchema,
    symbol: TokenSymbolSchema,
    description: z.string().optional(),
    imageUrl: ImageUrlSchema,
    externalUrl: ExternalUrlSchema,

    token: AddressSchema,
    epochSize: EpochSizeSchema,
    rate: z.bigint({invalid_type_error: "Invalid number"}).min(1n, 'Rate too low'),
    maxSupply: z.bigint({invalid_type_error: "Invalid number"}).min(0n, 'Cannot be a negative number'),
  });
</script>

<script lang="ts">
  import TextInput from '../form/TextInput.svelte';
  import { type CreateSubscriptionFunc } from '$lib/web3/contracts/subscription-handle';
  import NumberInput from '../form/NumberInput.svelte';
  import type {} from '@createz/contracts/types/ethers-contracts';
  import { createEventDispatcher } from 'svelte';
  import Button from '../Button.svelte';
  import { type CreateSubscriptionContractEvents } from '$lib/components/subscription/action/subscription-handle-events';
  import type {
    MetadataStructStruct,
    SubSettingsStruct
  } from '@createz/contracts/types/ethers-contracts/ISubscription.sol/ISubscription';
  import { log } from '$lib/logger';
  import { createMutation } from '@tanstack/svelte-query';
  import SuperDebug, {
    defaults,
    intProxy,
    setError,
    setMessage,
    superForm
  } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { z } from 'zod';
  import {
    TokenSymbolSchema,
    TokenNameSchema,
    ImageUrlSchema,
    ExternalUrlSchema,

    AddressSchema

  } from '$lib/web3/contracts/common';
    import EpochSizeInput, { EpochSizeSchema } from '../form/EpochSizeInput.svelte';
    import RateInput from '../form/RateInput.svelte';
    import MaxSupplyInput from '../form/MaxSupplyInput.svelte';

  export let create: CreateSubscriptionFunc;

  const dispatch = createEventDispatcher<CreateSubscriptionContractEvents>();

  const createContract = createMutation({
    mutationFn: async ([name, symbol, metadata, subSettings]: Parameters<typeof create>) =>
      create(name, symbol, metadata, subSettings, {
        onCreateTxSubmitted: (hash) => dispatch('createTxSubmitted', hash)
      }),
    onError: (error) => dispatch('txFailed', error),
    // TODO pass hash and address?
    onSuccess: (res) => {
      dispatch('created', [res, res]);
    }
  });

  // TODO check for any errors
  const form = superForm(defaults(zod(SubscriptionContractSchema)), {
    SPA: true,
    dataType: 'json',
    validators: zod(SubscriptionContractSchema),
    onUpdate: async ({ form }) => {
      log.info('On Update', form);
      log.info('errors', form.errors);
      if (form.valid) {
        const val = form.data;
        const metadata: MetadataStructStruct = {
          description: val.description ?? '',
          image: val.imageUrl ?? '',
          externalUrl: val.externalUrl ?? ''
        };

        log.info('epochSize:', val.epochSize);

        const subSettings: SubSettingsStruct = {
          token: val.subSettings.token,
          rate: val.subSettings.rate,
          lock: val.subSettings.lock,
          epochSize: val.subSettings.epochSize,
          maxSupply: val.subSettings.maxSupply
        };

        log.debug('creating new subscription plan', val.name, val.symbol, metadata, subSettings);
        const res = await $createContract.mutateAsync([
          val.name,
          val.symbol,
          metadata,
          subSettings
        ]);
        setMessage(form, 'success ' + res);
      } else {
        setError(form, 'invalid');
      }
    },
    onUpdated: async (data) => {
      log.info('onUpdated', data);
    },
    // onChange: async (data) => {
    //   log.info("onChange", data);
    //   },
    onSubmit: async (data) => {
      log.info('OnSubmit', data);
    }
  });
  const { form: formData, errors, enhance } = form;
  // const { form, errors } = createForm<SubscriptionContractProps>({
  //   async onSubmit(val) {
  //     log.debug('onSubmit');
  //     const metadata: MetadataStructStruct = {
  //       description: val.metadata.description ?? '',
  //       image: val.metadata.image ?? '',
  //       externalUrl: val.metadata.external_url ?? ''
  //     };
  //
  //     const subSettings: SubSettingsStruct = {
  //       token: val.subSettings.token,
  //       rate: val.subSettings.rate,
  //       lock: val.subSettings.lock,
  //       epochSize: val.subSettings.epochSize,
  //       maxSupply: val.subSettings.maxSupply
  //     };
  //
  //     log.debug('creating new subscription plan', val.name, val.symbol, metadata, subSettings);
  //     return await $createContract.mutateAsync([val.name, val.symbol, metadata, subSettings]);
  //   },
  //   transform: (value: any) => {
  //     if (value.subSettings.rate) value.subSettings.rate = BigInt(value.subSettings.rate);
  //     if (value.subSettings.epochSize)
  //       value.subSettings.epochSize = BigInt(value.subSettings.epochSize);
  //     if (value.subSettings.maxSupply) {
  //       value.subSettings.maxSupply = BigInt(value.subSettings.maxSupply);
  //     } else {
  //       value.subSettings.maxSupply = MaxUint256;
  //     }
  //     return value as SubscriptionContractProps;
  //   },
  //   // TODO set proper validation
  //   extend: [validator({ schema: SubscriptionContractPropsSchema }), reporter]
  // });

</script>

<div>
  {#if $createContract.isError}
    fail...
    {$createContract.error}
  {/if}
  <form method="POST" use:enhance>
    <fieldset disabled={$createContract.isPending}>
      <legend>Name</legend>
      <!-- <Form.Field {form} name="subSettings.token" class=""> -->
      <!-- <Form.ElementField {form} name="subSettings.token" class={"pt-0"}> -->
      <!--   <Form.Control let:attrs> -->
      <!--     <Form.Label>Token</Form.Label> -->
      <!--     <Input {...attrs} bind:value={$formData.subSettings.token} /> -->
      <!--   </Form.Control> -->
      <!--   <Form.Description>This is your public display name.</Form.Description> -->
      <!--   <Form.FieldErrors /> -->
      <!-- </Form.ElementField> -->
      <!-- </Form.Field> -->
      <TextInput {form} bind:value={$formData.name} name="name" label="Name" required />
      <TextInput
        {form}
        bind:value={$formData.symbol}
        name="symbol"
        label="Symbol"
        required
        minLength={2}
        maxLength={12}
      />
    </fieldset>
    <fieldset disabled={$createContract.isPending}>
      <legend>Metadata</legend>
      <TextInput
        {form}
        bind:value={$formData.description}
        name="description"
        label="Description"
      />
      <TextInput
        {form}
        bind:value={$formData.imageUrl}
        name="imageUrl"
        label="Image URL"
      />
      <TextInput
        {form}
        bind:value={$formData.externalUrl}
        name="externalUrl"
        label="External URL"
      />
    </fieldset>
    <!-- <fieldset disabled={$createContract.isPending}> -->
    <!--   <legend>Subscription Config</legend> -->
      <TextInput
        {form}
        bind:value={$formData.token}
        name="token"
        label="Token Address"
        required
      />
    <EpochSizeInput {form} name="epochSize" bind:value={$formData.epochSize}/>
    <RateInput {form} name="rate" bind:value={$formData.rate} />
    <MaxSupplyInput {form} name="maxSupply" bind:value={$formData.maxSupply} required/>
    <!--   <NumberInput -->
    <!--     {form} -->
    <!--     bind:value={$rateProxy} -->
    <!--     name="subSettings.rate" -->
    <!--     label="Rate per Block" -->
    <!--     required -->
    <!--   /> -->
    <!--   <NumberInput -->
    <!--     {form} -->
    <!--     bind:value={$lockProxy} -->
    <!--     name="subSettings.lock" -->
    <!--     label="% of locked funds" -->
    <!--     required -->
    <!--   /> -->
    <!--   <NumberInput -->
    <!--     {form} -->
    <!--     bind:value={$maxSupplyProxy} -->
    <!--     name="subSettings.maxSupply" -->
    <!--     label="Max supply of tokens" -->
    <!--   /> -->
    <!-- </fieldset> -->
    <div>
      <Button label="create" type="submit" isDisabled={$createContract.isPending} primary={true} />
    </div>
  </form>
  <SuperDebug data={formData} />
</div>
