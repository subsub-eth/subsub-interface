<script lang="ts">
  import SingleStringFieldForm, {
    type FieldChangeEvents
  } from '$lib/components/form/SingleStringFieldForm.svelte';
  import type { SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';
  import { createEventDispatcher, type EventDispatcher } from 'svelte';
  import type {
    DescriptionChangeEvents,
    ExternalUrlChangeEvents,
    ImageChangeEvents,
    MetadataChangeContractEvents
  } from './subscription-events';
  import { ExternalUrlSchema, ImageUrlSchema } from '$lib/web3/contracts/common';

  export let metadata: SubscriptionContractMetadata;

  export let setDescription: (
    description: string,
    dispatcher: EventDispatcher<DescriptionChangeEvents>
  ) => Promise<string>;
  export let setImage: (
    image: string,
    dispatcher: EventDispatcher<ImageChangeEvents>
  ) => Promise<string>;
  export let setExternalUrl: (
    externalUrl: string,
    dispatcher: EventDispatcher<ExternalUrlChangeEvents>
  ) => Promise<string>;

  const dispatch = createEventDispatcher<MetadataChangeContractEvents>();

  const mapDescriptionEvents = (
    d: EventDispatcher<FieldChangeEvents>
  ): EventDispatcher<DescriptionChangeEvents> => {
    const func = (s: keyof DescriptionChangeEvents, args: unknown) => {
      if (s === 'descriptionTxSubmitted') {
        return d('txSubmitted', args as string);
      } else if (s === 'descriptionChanged') {
        return d('valueChanged', args as [string, string]);
      }
    };
    return func as EventDispatcher<FieldChangeEvents>;
  };

  const mapImageEvents = (
    d: EventDispatcher<FieldChangeEvents>
  ): EventDispatcher<ImageChangeEvents> => {
    const func = (s: keyof ImageChangeEvents, args: unknown) => {
      if (s === 'imageTxSubmitted') {
        return d('txSubmitted', args as string);
      } else if (s === 'imageChanged') {
        return d('valueChanged', args as [string, string]);
      }
    };
    return func as EventDispatcher<FieldChangeEvents>;
  };

  const mapExternalUrlEvents = (
    d: EventDispatcher<FieldChangeEvents>
  ): EventDispatcher<ExternalUrlChangeEvents> => {
    const func = (s: keyof ExternalUrlChangeEvents, args: unknown) => {
      if (s === 'externalUrlTxSubmitted') {
        return d('txSubmitted', args as string);
      } else if (s === 'externalUrlChanged') {
        return d('valueChanged', args as [string, string]);
      }
    };
    return func as EventDispatcher<FieldChangeEvents>;
  };
</script>

<SingleStringFieldForm
  label="Description"
  value={metadata.description}
  handle={async (s, d) => {
    return setDescription(s, mapDescriptionEvents(d));
  }}
  on:txFailed
  on:txSubmitted={({ detail }) => dispatch('descriptionTxSubmitted', detail)}
  on:valueChanged={({ detail }) => dispatch('descriptionChanged', detail)}
/>
<SingleStringFieldForm
  label="Image"
  value={metadata.image}
  handle={async (s, d) => {
    return setImage(s, mapImageEvents(d));
  }}
  validatorSchema={ImageUrlSchema}
  on:txFailed
  on:txSubmitted={({ detail }) => dispatch('imageTxSubmitted', detail)}
  on:valueChanged={({ detail }) => dispatch('imageChanged', detail)}
/>
<SingleStringFieldForm
  label="External URL"
  value={metadata.external_url}
  handle={async (s, d) => {
    return setExternalUrl(s, mapExternalUrlEvents(d));
  }}
  validatorSchema={ExternalUrlSchema}
  on:txFailed
  on:txSubmitted={({ detail }) => dispatch('externalUrlTxSubmitted', detail)}
  on:valueChanged={({ detail }) => dispatch('externalUrlChanged', detail)}
/>
