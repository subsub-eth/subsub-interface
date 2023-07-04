<script lang="ts">
  import { createForm } from 'felte';
  import TextInput from '../form/TextInput.svelte';
  import {
    SubscriptionContractPropsSchema,
    type SubscriptionContractProps
  } from '$lib/web3/contracts/subscription-manager';
  import { validator } from '@felte/validator-zod';
  import { reporter } from '@felte/reporter-svelte';
  import NumberInput from '../form/NumberInput.svelte';
  import type {
    MetadataStruct,
    SubSettingsStruct
  } from '@createz/contracts/types/ethers-contracts/Subscription';
  import type { ISubscriptionManager } from '@createz/contracts/types/ethers-contracts';
  import { createEventDispatcher } from 'svelte';
  import { matchEvents } from '$lib/web3/ethers';

  export let managerContract: ISubscriptionManager;
  export let creatorId: bigint;

  let formDisabled = false;
  const dispatch = createEventDispatcher();

  $: ({ form } = createForm<SubscriptionContractProps>({
    async onSubmit(val) {
      const metadata: MetadataStruct = {
        title: val.metadata.name,
        description: val.metadata.description ?? '',
        image: val.metadata.image ?? '',
        externalUrl: val.metadata.external_url ?? ''
      };

      const subSettings: SubSettingsStruct = {
        token: val.subSettings.token,
        rate: val.subSettings.rate,
        lock: val.subSettings.lock,
        epochSize: val.subSettings.epochSize
      };
      try {
        formDisabled = true;
        const tx = await managerContract.createSubscription(
          val.name,
          val.symbol,
          metadata,
          subSettings,
          creatorId
        );
        dispatch('txSubmitted', tx.hash);

        const receipt = await tx.wait();

        const logs = receipt?.logs;
        const res = await matchEvents(
          logs as [],
          managerContract,
          managerContract.filters.SubscriptionContractCreated(creatorId)
        );
        if (res[0]) {
          const newContract = res[0].args.contractAddress;
          dispatch('contractCreated', newContract);
        }
        // TODO handle waiting time
      } catch (err: any) {
        dispatch('txFailed', err);

      } finally {
        formDisabled = false;
      }
    },
    transform: (value: any) => {
      console.log('transform', value);
      if (!!value.subSettings.rate) value.subSettings.rate = BigInt(value.subSettings.rate);
      if (!!value.subSettings.epochSize)
        value.subSettings.epochSize = BigInt(value.subSettings.epochSize);
      return value as SubscriptionContractProps;
    },
    extend: [validator({ schema: SubscriptionContractPropsSchema }), reporter]
  }));
</script>

<div>
  <form use:form>
    <fieldset disabled={formDisabled}>
      <legend>Name</legend>
      <TextInput name="name" label="Name" required />
      <TextInput name="symbol" label="Symbol" required minLength={2} maxLength={12} />
    </fieldset>
    <fieldset disabled={formDisabled}>
      <legend>Metadata</legend>
      <TextInput name="metadata.name" label="Metadata Name" required />
      <TextInput name="metadata.description" label="Description" />
      <TextInput name="metadata.image" label="Image URL" />
      <TextInput name="metadata.external_url" label="External URL" />
    </fieldset>
    <fieldset disabled={formDisabled}>
      <legend>Subscription Config</legend>
      <TextInput name="subSettings.token" label="Token Address" required />
      <NumberInput name="subSettings.rate" label="Rate per Block" required />
      <NumberInput name="subSettings.lock" label="% of locked funds" required />
      <NumberInput name="subSettings.epochSize" label="Size of an Epoch" required />
    </fieldset>
    <div>
      <button type="submit" disabled={formDisabled}>create</button>
    </div>
  </form>
</div>
