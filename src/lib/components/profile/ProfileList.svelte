<script lang="ts">
  import type { ProfileTokenMetadata } from '$lib/web3/contracts/profile';
  import Paging from '../Paging.svelte';
  import ProfileTeaser from './ProfileTeaser.svelte';

  export let pages: number;
  export let load: (page: number) => Promise<Array<[bigint, ProfileTokenMetadata]>>;

  let currentPage = 0;

  const setPage = (newPage: number) => (currentPage = newPage);
</script>

<div>
  {#if pages == 0}
    No Profiles
  {:else}
    {#await load(currentPage)}
      Loading Profiles ...
    {:then data}
      {#each data as [tokenId, metadata]}
        <ProfileTeaser id={tokenId} {metadata} />
      {/each}
    {:catch err}
      failed to load profiles {err}
    {/await}
    <Paging current={currentPage} size={pages} {setPage} />
  {/if}
</div>
