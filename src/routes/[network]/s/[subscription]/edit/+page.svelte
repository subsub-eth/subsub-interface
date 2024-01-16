<script lang="ts">
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import {
    EthersContext,
    SubscriptionContractContext,
    SubscriptionContractMetadataContext
  } from '$lib/components/context/web3';
  import EditSubscriptionContractForm from '$lib/components/subscription/action/EditSubscriptionContractForm.svelte';
    import { setDescription, setExternalUrl, setImage } from '$lib/web3/contracts/subscription';

  export let data: PageData;

  const addr = data.subscriptionAddr;
</script>

<h1>Edit Subscription Contract</h1>

<EthersContext let:ethersSigner>
  <SubscriptionContractContext address={addr} {ethersSigner} let:subscriptionContract>
    <SubscriptionContractMetadataContext contract={subscriptionContract} let:metadata>
      <EditSubscriptionContractForm {metadata}
      setDescription={setDescription(subscriptionContract)}
      setImage={setImage(subscriptionContract)}
      setExternalUrl={setExternalUrl(subscriptionContract)}
        on:descriptionTxSubmitted={(s) => console.log('yay', s)}
      />
    </SubscriptionContractMetadataContext>
  </SubscriptionContractContext>
</EthersContext>
