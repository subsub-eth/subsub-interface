<script lang="ts">
  import type { Profile } from '@createz/contracts/types/ethers-contracts';
  import ProfileTeaser from './ProfileTeaser.svelte';

  export let load: () => Promise<Array<bigint>>;
  export let profile: Profile;
</script>

<div>
  {#await load()}
    loading...
  {:then ids}
    {#if ids.length === 0}
      <p>None</p>
    {:else}
      <ul>
        {#each ids as id}
          <li>
            <ProfileTeaser {id} {profile} />
          </li>
        {/each}
      </ul>
    {/if}
  {:catch err}
    <!-- TODO -->
    error: {err}
  {/await}
</div>
