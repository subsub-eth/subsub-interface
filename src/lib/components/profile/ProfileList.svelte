<script lang="ts">
    import type { ProfileTokenMetadata } from '$lib/web3/contracts/profile';
  import ProfileTeaser from './ProfileTeaser.svelte';

  export let pages: number;
  export let load: (
    page: number
  ) => Promise<Array<[bigint, ProfileTokenMetadata]>>;

  let currentPage = 0;
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
    <div>Page: {currentPage + 1} / {pages}</div>
  {/if}
</div>
