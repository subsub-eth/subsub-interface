<script lang="ts">
  import { type AttributesMetadata } from '$lib/web3/contracts/common';
  import { decodeDataJsonTokenURI } from '$lib/web3/helpers';
  import { type Subscription } from '@createz/contracts/types/ethers-contracts';

  export let contract: Subscription;

  const metadata = async () => {
    const encoded = await contract.contractURI();
    return decodeDataJsonTokenURI<AttributesMetadata>(encoded);
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
    {#each metadata.attributes ?? [] as attribute}
      <div>
        {attribute.trait_type}: {attribute.value}
      </div>
    {/each}
  {:catch err}
    error {err}
  {/await}
</div>
