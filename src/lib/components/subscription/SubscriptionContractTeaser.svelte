<script lang="ts">
  import { NETWORK, requireContext } from '$lib/contexts';
  import type { SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';
  import { ethersSigner } from '$lib/web3/ethers';
  import { decodeDataJsonTokenURI } from '$lib/web3/helpers';
  import { ISubscription__factory } from '@createz/contracts/types/ethers-contracts';

  export let address: string;

  // TODO better way to generate links?
  const network = requireContext<string>(NETWORK);

  const subscription = ISubscription__factory.connect(address, $ethersSigner);

  // TODO reactive? on chain change is the component reused if the address changes
  const metadata = async () => {
    const encoded = await subscription.contractURI();
    return decodeDataJsonTokenURI<SubscriptionContractMetadata>(encoded);
  };
</script>

<div class="p-2 rounded-xl border-2 border-solid">
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
    {#each metadata.attributes ?? [] as attribute}
      <div>
        {attribute.trait_type}: {attribute.value}
      </div>
    {/each}
    <div>
      <a href={`/${network}/subscription/${address}/`}>Details</a>
    </div>
  {:catch err}
    error {err}
  {/await}
</div>
