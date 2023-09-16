<script lang="ts">
  import { rangeArray } from '$lib/helpers';

  /**
   * current page from index 0
   */
  export let current: number;
  /**
   * total number of pages
   */
  export let size: number;

  /**
   * range to left and right of the current page
   */
  export let rangeSize: number = 2;

  /**
   * set new page number
   */
  export let setPage: (newPage: number) => void;

  $: range = rangeArray(
    Math.max(1, current + 1 - rangeSize),
    Math.min(size, current + 1 + rangeSize)
  );
</script>

<nav>
  <ul>
    <li>
      {#if current + 1 === range[0]}
        previous
      {:else}
        <a on:click={() => setPage(current - 1)}> previous </a>
      {/if}
    </li>
    {#each range as i}
      <li>
        {#if i !== current + 1}
          <a on:click={() => setPage(i - 1)}>
            {i}
          </a>
        {:else}
          -{i}-
        {/if}
      </li>
    {/each}
    <li>
      {#if current + 1 === range[range.length - 1]}
        next
      {:else}
        <a on:click={() => setPage(current + 1)}> next </a>
      {/if}
    </li>
  </ul>
</nav>
