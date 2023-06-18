<script lang="ts">
    import { page } from '$app/stores';
  import { CREATOR_CONTRACT, requireContext } from '$lib/contexts';
  import { decodeDataJsonTokenURI } from '$lib/web3/helpers';
  import type { Creator } from '@createz/contracts/types/ethers-contracts/Creator';
  import type { Readable } from 'svelte/store';

  export let id: bigint;

  const creator = requireContext<Readable<Creator>>(CREATOR_CONTRACT);

  $: tokenUri = $creator.tokenURI(id);

  const decode = (encodedJson: string) => decodeDataJsonTokenURI<CreatorMetadata>(encodedJson);
</script>

<div>
  <p>id: {id}</p>
  <p><a href={`${$page.url.pathname}${id}/`}>Details</a></p>

  {#await tokenUri}
    loading...
  {:then tokenUri}
    {#if tokenUri}
      {@const data = decode(tokenUri)}
      <img src="{data.image}" alt="image of {data.name}"/>
      <p>{data.name}</p>
      <p>{data.description}</p>
      <p><a href="{data.external_url}" target="_blank">External Link</a></p>
    {/if}
  {:catch err}
    <!-- TODO -->
    error {err}
  {/await}
</div>
