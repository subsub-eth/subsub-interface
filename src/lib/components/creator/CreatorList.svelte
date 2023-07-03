<script lang="ts">
  import type { Creator } from '@createz/contracts/types/ethers-contracts';
  import CreatorTeaser from './CreatorTeaser.svelte';

  export let load: () => Promise<Array<bigint>>;
  export let creator: Creator;
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
            <CreatorTeaser {id} {creator} />
          </li>
        {/each}
      </ul>
    {/if}
  {:catch err}
    <!-- TODO -->
    error: {err}
  {/await}
</div>
