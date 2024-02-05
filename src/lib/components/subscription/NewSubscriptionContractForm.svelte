<script lang="ts">
  import { createForm } from 'felte';
  import TextInput from '../form/TextInput.svelte';
  import {
    SubscriptionContractPropsSchema,
    type SubscriptionContractProps,
    type CreateSubscriptionFunc
  } from '$lib/web3/contracts/subscription-handle';
  import { validator } from '@felte/validator-zod';
  import { reporter } from '@felte/reporter-svelte';
  import NumberInput from '../form/NumberInput.svelte';
  import type {} from '@createz/contracts/types/ethers-contracts';
  import { createEventDispatcher } from 'svelte';
  import Button from '../Button.svelte';
  import { type CreateSubscriptionContractEvents } from '$lib/components/subscription/action/subscription-handle-events';
  import type {
    MetadataStructStruct,
    SubSettingsStruct
  } from '@createz/contracts/types/ethers-contracts/ISubscription.sol/ISubscription';
  import { MaxUint256 } from 'ethers';
  import { log } from '$lib/logger';
  import { createMutation } from '@tanstack/svelte-query';

  export let create: CreateSubscriptionFunc;

  const dispatch = createEventDispatcher<CreateSubscriptionContractEvents>();

  const createContract = createMutation({
    mutationFn: async ([name, symbol, metadata, subSettings, events]: Parameters<typeof create>) =>
      create(name, symbol, metadata, subSettings, events),
    onError: (error) => dispatch('txFailed', error),
    // TODO pass hash and address?
    onSuccess: (res) => {
      dispatch('created', [res, res]);
    }
  });

  // TODO check for any errors
  const { form, errors } = createForm<SubscriptionContractProps>({
    async onSubmit(val) {
      log.debug('onSubmit');
      const metadata: MetadataStructStruct = {
        description: val.metadata.description ?? '',
        image: val.metadata.image ?? '',
        externalUrl: val.metadata.external_url ?? ''
      };

      const subSettings: SubSettingsStruct = {
        token: val.subSettings.token,
        rate: val.subSettings.rate,
        lock: val.subSettings.lock,
        epochSize: val.subSettings.epochSize,
        maxSupply: val.subSettings.maxSupply
      };

      log.debug('creating new subscription plan', val.name, val.symbol, metadata, subSettings);
      await $createContract.mutateAsync([
        val.name,
        val.symbol,
        metadata,
        subSettings,
        {
          onCreateTxSubmitted: (hash) => dispatch('createTxSubmitted', hash)
        }
      ]);
    },
    transform: (value: any) => {
      if (value.subSettings.rate) value.subSettings.rate = BigInt(value.subSettings.rate);
      if (value.subSettings.epochSize)
        value.subSettings.epochSize = BigInt(value.subSettings.epochSize);
      if (value.subSettings.maxSupply) {
        value.subSettings.maxSupply = BigInt(value.subSettings.maxSupply);
      } else {
        value.subSettings.maxSupply = MaxUint256;
      }
      return value as SubscriptionContractProps;
    },
    // TODO set proper validation
    extend: [validator({ schema: SubscriptionContractPropsSchema }), reporter]
  });
</script>

<div>
  {#if $createContract.isError}
    fail...
    {$createContract.error}
  {/if}
  <form use:form>
    <fieldset disabled={$createContract.isPending}>
      <legend>Name</legend>
      <TextInput name="name" label="Name" required />
      <TextInput name="symbol" label="Symbol" required minLength={2} maxLength={12} />
    </fieldset>
    <fieldset disabled={$createContract.isPending}>
      <legend>Metadata</legend>
      <TextInput name="metadata.description" label="Description" />
      <TextInput name="metadata.image" label="Image URL" />
      <TextInput name="metadata.external_url" label="External URL" />
    </fieldset>
    <fieldset disabled={$createContract.isPending}>
      <legend>Subscription Config</legend>
      <TextInput name="subSettings.token" label="Token Address" required />
      <NumberInput name="subSettings.rate" label="Rate per Block" required />
      <NumberInput name="subSettings.lock" label="% of locked funds" required />
      <NumberInput name="subSettings.epochSize" label="Size of an Epoch" required />
      <NumberInput name="subSettings.maxSupply" label="Max supply of tokens" />
    </fieldset>
    <div>
      <Button label="create" type="submit" isDisabled={$createContract.isPending} primary={true} />
    </div>
  </form>
</div>
