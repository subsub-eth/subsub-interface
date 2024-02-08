<script lang="ts">
  import SingleStringFieldForm from '$lib/components/form/SingleStringFieldForm.svelte';
  import type {
    SubscriptionContractData,
    UpdateDescription,
    UpdateExternalUrl,
    UpdateImage
  } from '$lib/web3/contracts/subscription';
  import { createEventDispatcher } from 'svelte';
  import type { MetadataChangeContractEvents } from './subscription-events';
  import { ExternalUrlSchema, ImageUrlSchema } from '$lib/web3/contracts/common';

  export let data: SubscriptionContractData;

  export let setDescription: UpdateDescription;
  export let setImage: UpdateImage;
  export let setExternalUrl: UpdateExternalUrl;

  const dispatch = createEventDispatcher<MetadataChangeContractEvents>();
</script>

<SingleStringFieldForm
  label="Description"
  value={data.description}
  handle={async (s, e) => {
    return setDescription(s, { onDescriptionTxSubmitted: e?.onTxSubmitted });
  }}
  on:txFailed
  on:txSubmitted={({ detail }) => dispatch('descriptionTxSubmitted', detail)}
  on:valueChanged={({ detail }) => dispatch('descriptionChanged', detail)}
/>
<SingleStringFieldForm
  label="Image"
  value={data.image}
  handle={async (s, e) => {
    return setImage(s, { onImageTxSubmitted: e?.onTxSubmitted });
  }}
  validatorSchema={ImageUrlSchema}
  on:txFailed
  on:txSubmitted={({ detail }) => dispatch('imageTxSubmitted', detail)}
  on:valueChanged={({ detail }) => dispatch('imageChanged', detail)}
/>
<SingleStringFieldForm
  label="External URL"
  value={data.externalUrl}
  handle={async (s, e) => {
    return setExternalUrl(s, { onExternalUrlTxSubmitted: e?.onTxSubmitted });
  }}
  validatorSchema={ExternalUrlSchema}
  on:txFailed
  on:txSubmitted={({ detail }) => dispatch('externalUrlTxSubmitted', detail)}
  on:valueChanged={({ detail }) => dispatch('externalUrlChanged', detail)}
/>
