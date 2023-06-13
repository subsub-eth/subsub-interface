<script lang="ts">
  export let load: () => Promise<Array<bigint>>;
</script>

<div>
  'creator list'
  {#await load()}
    loading...
  {:then ids}
    <ul>
      {#each ids as id}
        <li>{id}</li>
      {/each}
    </ul>
  {:catch err}
    <!-- TODO -->
    error: {err}
  {/await}
</div>
