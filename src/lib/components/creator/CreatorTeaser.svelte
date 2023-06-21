<script lang="ts">
  import { page } from '$app/stores';
  import { CREATOR_CONTRACT, requireContext } from '$lib/contexts';
  import type { CreatorMetadata } from '$lib/web3/contracts/creator';
  import { decodeDataJsonTokenURI } from '$lib/web3/helpers';
  import type { Creator } from '@createz/contracts/types/ethers-contracts/Creator';
  import type { Readable } from 'svelte/store';

  export let id: bigint;

  const creator = requireContext<Readable<Creator>>(CREATOR_CONTRACT);

  $: tokenUri = $creator.tokenURI(id);

  const decode = (encodedJson: string) => decodeDataJsonTokenURI<CreatorMetadata>(encodedJson);
</script>

<div class="p-2 rounded-xl border-2 border-solid">
  <p>id: {id}</p>
  <p><a href={`${$page.url.pathname}${id}/`}>Details</a></p>

  {#await tokenUri}
    loading...
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
      Invalid creator data found
    {/if}
  {:catch err}
    <!-- TODO -->
    error {err}
  {/await}
</div>
