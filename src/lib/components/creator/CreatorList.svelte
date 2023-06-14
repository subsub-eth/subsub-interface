<script lang="ts">
  import CreatorTeaser from './CreatorTeaser.svelte';

  export let load: () => Promise<Array<bigint>>;
</script>

<div>
  'creator list'
  {#await load()}
    loading...
  {:then ids}
    {#if ids.length === 0}
      <p>None</p>
    {:else}
      <ul>
        {#each ids as id}
          <li>
            <CreatorTeaser {id} />
          </li>
        {/each}
      </ul>
    {/if}
  {:catch err}
    <!-- TODO -->
    error: {err}
  {/await}
</div>
