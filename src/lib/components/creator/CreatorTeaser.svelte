<script lang="ts">
  import { CREATOR_CONTRACT, NETWORK, requireContext } from '$lib/contexts';
  import { decodeDataJsonTokenURI } from '$lib/web3/helpers';
  import type { Creator } from '@createz/contracts/types/ethers-contracts/Creator';
  import type { Readable } from 'svelte/store';

  export let id: bigint;

  const network: string = requireContext(NETWORK);

  const creator = requireContext<Readable<Creator>>(CREATOR_CONTRACT);

  $: tokenUri = $creator.tokenURI(id);

  const decode = (encodedJson: string) => decodeDataJsonTokenURI<CreatorMetadata>(encodedJson);
</script>

<div>
  <p>id: {id}</p>
  <p><a href={`/${network}/creator/${id}`}>Details</a></p>

  {#await tokenUri}
    loading...
  {:then tokenUri}
    {#if tokenUri}
      {@const data = decode(tokenUri)}
      <p>{data.name}</p>
      <p>{data.description}</p>
    {/if}
  {:catch err}
    <!-- TODO -->
    error {err}
  {/await}
</div>
