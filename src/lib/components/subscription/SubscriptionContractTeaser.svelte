<script lang="ts">
  import type { SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';
  import { ethersSigner } from '$lib/web3/ethers';
  import { decodeDataJsonTokenURI } from '$lib/web3/helpers';
  import { ISubscription__factory } from '@createz/contracts/types/ethers-contracts';

  export let address: string;

  const subscription = ISubscription__factory.connect(address, $ethersSigner);

  const metadata = async () => {
    const encoded = await subscription.contractURI();
    return decodeDataJsonTokenURI<SubscriptionContractMetadata>(encoded);
  };
</script>

<div>
  {#await metadata()}
    Loading...
  {:then metadata}
    <img src={metadata.image} alt={metadata.name} />
    <div>
      Title: {metadata.name}
    </div>
    <div>
      description: {metadata.description}
    </div>
    <div>
      <a href={metadata.external_url}>external url</a>
    </div>
  {:catch err}
    error {err}
  {/await}
</div>
