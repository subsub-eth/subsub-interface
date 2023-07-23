<script lang="ts">
  import { profileImageFallback } from '$lib/static-content';
  import type { Metadata } from '$lib/web3/contracts/common';
  import { decodeDataJsonTokenURI } from '$lib/web3/helpers';
  import type { Profile } from '@createz/contracts/types/ethers-contracts';

  export let id: bigint;
  export let profile: Profile;

  const decode = (encodedJson: string) => decodeDataJsonTokenURI<Metadata>(encodedJson);

  $: tokenData = (async () => decode(await profile.tokenURI(id)))();
</script>

<div class="rounded-xl border-2 border-solid p-2">
  {#await tokenData}
    Loading ...
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
      No Profile details found
    {/if}
  {:catch error}
    Failed to retrieve Profile details: {error}
  {/await}
</div>
