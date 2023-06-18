<script lang="ts">
  import { decodeDataJsonTokenURI } from '$lib/web3/helpers';
  import type { Creator } from '@createz/contracts/types/ethers-contracts/Creator';

  export let id: bigint;
  export let creator: Creator;

  const tokenUri = creator.tokenURI(id);

  const decode = (encodedJson: string) => decodeDataJsonTokenURI<CreatorMetadata>(encodedJson);
</script>

<div>
  {#await tokenUri}
    Loading ...
  {:then tokenUri}
    {#if tokenUri}
      {@const data = decode(tokenUri)}
      {#if data.image}
        <img src={data.image} alt="image of {data.name}" />
      {/if}
      <p>{data.name}</p>
      {#if data.description}
        <p>{data.description}</p>
      {/if}
      {#if data.external_url}
        <p><a href={data.external_url} target="_blank">External Link</a></p>
      {/if}
    {:else}
      No Creator details found
    {/if}
  {:catch error}
    Failed to retrieve Creator details: {error}
  {/await}
</div>
