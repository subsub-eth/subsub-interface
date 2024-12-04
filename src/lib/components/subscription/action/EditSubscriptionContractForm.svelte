<script lang="ts">
  import SingleStringFieldForm from '$lib/components/form/SingleStringFieldForm.svelte';
  import type {
    SubscriptionContractData,
    UpdateDescription,
    UpdateExternalUrl,
    UpdateImage
  } from '$lib/web3/contracts/subscription';
  import type { MetadataChangeContractEvents } from './subscription-events';
  import { ExternalUrlSchema, ImageUrlSchema } from '$lib/web3/contracts/common';

  interface Props extends MetadataChangeContractEvents {
    data: SubscriptionContractData;
    setDescription: UpdateDescription;
    setImage: UpdateImage;
    setExternalUrl: UpdateExternalUrl;
  }

  let {
    data,
    setDescription,
    setImage,
    setExternalUrl,
    onTxFailed,
    onImageChanged,
    onImageTxSubmitted,
    onDescriptionChanged,
    onExternalUrlChanged,
    onDescriptionTxSubmitted,
    onExternalUrlTxSubmitted
  }: Props = $props();
</script>

<SingleStringFieldForm
  formId={`description`}
  label="Description"
  type="textarea"
  value={data.description}
  handle={async (s, e) => {
    return setDescription(s, { onDescriptionTxSubmitted: e?.onTxSubmitted });
  }}
  {onTxFailed}
  onTxSubmitted={onDescriptionTxSubmitted}
  onValueChanged={onDescriptionChanged}
/>
<SingleStringFieldForm
  formId={`image`}
  label="Image"
  value={data.image}
  handle={async (s, e) => {
    return setImage(s, { onImageTxSubmitted: e?.onTxSubmitted });
  }}
  validatorSchema={ImageUrlSchema}
  {onTxFailed}
  onTxSubmitted={onImageTxSubmitted}
  onValueChanged={onImageChanged}
/>
<SingleStringFieldForm
  formId={`externalUrl`}
  label="External URL"
  value={data.externalUrl}
  handle={async (s, e) => {
    return setExternalUrl(s, { onExternalUrlTxSubmitted: e?.onTxSubmitted });
  }}
  validatorSchema={ExternalUrlSchema}
  {onTxFailed}
  onTxSubmitted={onExternalUrlTxSubmitted}
  onValueChanged={onExternalUrlChanged}
/>
