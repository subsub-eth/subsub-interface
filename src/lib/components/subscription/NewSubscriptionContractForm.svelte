<script lang="ts" module>
  const SubscriptionContractSchema = z.object({
    name: TokenNameSchema,
    symbol: TokenSymbolSchema,
    description: z.string().optional(),
    imageUrl: ImageUrlSchema,
    externalUrl: ExternalUrlSchema,

    token: AddressSchema,
    epochSize: EpochSizeSchema,
    lock: z
      .number()
      .multipleOf(0.01)
      .min(0, 'Cannot be negative')
      .max(100, 'Value too high')
      .default(undefined as unknown as number), // dirty hacks!
    rate: z.bigint({ invalid_type_error: 'Invalid number' }).min(1n, 'Rate too low'),
    maxSupply: z
      .bigint({ invalid_type_error: 'Invalid number' })
      .min(0n, 'Cannot be a negative number')
  });

  const day = 60n * 60n * 24n;
  const week = day * 7n;
  const month = week * 30n;
</script>

<script lang="ts">
  import TextInput from '../form/TextInput.svelte';
  import TextareaInput from '../form/TextareaInput.svelte';
  import {
    type CreateSubscriptionFunc,
    type Metadata,
    type SubSettings
  } from '$lib/web3/contracts/subscription-handle';
  import NumberInput from '../form/NumberInput.svelte';
  import Button from '../Button.svelte';
  import { type CreateSubscriptionContractEvents } from '$lib/components/subscription/action/subscription-handle-events';
  import { log } from '$lib/logger';
  import { createMutation } from '@tanstack/svelte-query';
  import SuperDebug, { defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { z } from 'zod';
  import {
    TokenSymbolSchema,
    TokenNameSchema,
    ImageUrlSchema,
    ExternalUrlSchema,
    AddressSchema,
    type Address
  } from '$lib/web3/contracts/common';
  import EpochSizeInput, { EpochSizeSchema } from '../form/EpochSizeInput.svelte';
  import RateInput from '../form/RateInput.svelte';
  import MaxSupplyInput from '../form/MaxSupplyInput.svelte';
  import TokenPickerInput from '../form/TokenPickerInput.svelte';
  import type { Erc20Data, Erc20Token } from '$lib/web3/contracts/erc20';

  interface Props extends CreateSubscriptionContractEvents {
    formId: string;
    create: CreateSubscriptionFunc;
    /** load function to search token on a specific address */
    tokenByAddress: (address: Address) => Promise<Erc20Data>;
    /** list of known tokens to display for quick pick */
    knownTokens?: Array<Erc20Token>;
  }

  let {
    formId,
    create,
    tokenByAddress,
    knownTokens = [],
    onCreateTxSubmitted,
    onCreated,
    onTxFailed
  }: Props = $props();

  const createContract = createMutation({
    mutationFn: async ([name, symbol, metadata, subSettings]: Parameters<typeof create>) =>
      create(name, symbol, metadata, subSettings, {
        onCreateTxSubmitted: (hash) => onCreateTxSubmitted?.(hash)
      }),
    onError: (error) => onTxFailed?.(error),
    onSuccess: ([address, tx]) => {
      onCreated?.(address, tx);
    }
  });

  // TODO check for any errors
  const form = superForm(defaults(zod(SubscriptionContractSchema)), {
    id: formId,
    SPA: true,
    dataType: 'json',
    validators: zod(SubscriptionContractSchema),
    onUpdate: async ({ form }) => {
      log.info('On Update', form);
      log.info('errors', form.errors);
      if (form.valid) {
        const val = form.data;
        const metadata: Metadata = {
          description: val.description ?? '',
          image: val.imageUrl ?? '',
          externalUrl: val.externalUrl ?? ''
        };

        log.info('epochSize:', val.epochSize);
        let epochSize: bigint;
        if (val.epochSize === 'day') {
          epochSize = day;
        } else if (val.epochSize === 'week') {
          epochSize = week;
        } else {
          epochSize = month;
        }

        const lock = BigInt(val.lock * 100);

        const subSettings: SubSettings = {
          token: val.token,
          rate: val.rate,
          lock: Number(lock),
          epochSize: epochSize,
          maxSupply: val.maxSupply
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
    }
  });

  const { form: formData, errors, enhance } = form;
</script>

<div>
  {#if $createContract.isError}
    fail...
    {$createContract.error}
  {/if}
  <form method="POST" use:enhance>
    <fieldset disabled={$createContract.isPending}>
      <legend>Name</legend>
      <TextInput {form} bind:value={$formData.name} name="name" label="Name" required />
      <TextInput
        {form}
        bind:value={$formData.symbol}
        name="symbol"
        label="Symbol"
        required
        minlength={2}
        maxlength={12}
      />
    </fieldset>
    <fieldset disabled={$createContract.isPending}>
      <legend>Metadata</legend>
      <TextareaInput
        {form}
        bind:value={$formData.description}
        name="description"
        label="Description"
      />
      <TextInput {form} bind:value={$formData.imageUrl} name="imageUrl" label="Image URL" />
      <TextInput
        {form}
        bind:value={$formData.externalUrl}
        name="externalUrl"
        label="External URL"
      />
    </fieldset>
    <TokenPickerInput
      {form}
      bind:value={$formData.token}
      name="token"
      label="Token Address"
      required
      {tokenByAddress}
      {knownTokens}
    />
    <RateInput {form} name="rate" bind:value={$formData.rate} />
    <EpochSizeInput {form} name="epochSize" bind:value={$formData.epochSize} />
    <NumberInput
      {form}
      label="Deposit Lock"
      name="lock"
      placeholder="5.5 %"
      bind:value={$formData.lock}
      required
      step={0.01}
      min={0}
      max={100}
    />
    <MaxSupplyInput {form} name="maxSupply" bind:value={$formData.maxSupply} required />
    <div>
      <Button type="submit" disabled={$createContract.isPending}>create</Button>
    </div>
    <div>
      {#if $errors._errors}
        {#each $errors._errors as err (err)}
          {err}
        {/each}
      {/if}
    </div>
  </form>
  <SuperDebug data={formData} />
</div>
