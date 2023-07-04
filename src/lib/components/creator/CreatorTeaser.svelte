<script lang="ts">
  import { page } from '$app/stores';
  import { profileImageFallback } from '$lib/static-content';
  import type { Metadata } from '$lib/web3/contracts/common';
  import { decodeDataJsonTokenURI } from '$lib/web3/helpers';
  import type { Creator } from '@createz/contracts/types/ethers-contracts/Creator';

  export let id: bigint;
  export let creator: Creator;

  const decode = (encodedJson: string) => decodeDataJsonTokenURI<Metadata>(encodedJson);
  $: tokenData = (async () => decode(await creator.tokenURI(id)))();
</script>

<div class="rounded-xl border-2 border-solid p-2">
  <p>id: {id}</p>
  <p><a href={`${$page.url.pathname}${id}/`}>Details</a></p>

  {#await tokenData}
    loading...
  {:then data}
    {#if data}
      {#if data.image}
        <img
          src={data.image}
          alt="image of {data.name}"
          on:error={() => (data.image = profileImageFallback)}
        />
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
