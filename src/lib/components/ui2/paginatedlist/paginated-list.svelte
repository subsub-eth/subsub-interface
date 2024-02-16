<script lang="ts" generics="T">
  import { writable } from 'svelte/store';
  import * as Pagination from '$lib/components/ui/pagination';

  /**
   * items to manage in this list
   */
  export let items: T[] /* eslint-disable-line no-undef */;
  /**
   * page to display
   */
  export let page: number = 1;

  /**
   * number of items per page
   */
  export let pageSize: number;

  const p = writable(page);

  $: {
    p.set(page);
  }

  const totalItems = items.length;

  $: currentItems = items.slice(($p - 1) * pageSize, $p * pageSize);
</script>

<div>
  <div>
    <slot {currentItems} />
  </div>
  <Pagination.Root
    count={totalItems == 0 ? 1 : totalItems}
    perPage={pageSize}
    let:pages
    let:currentPage
    bind:page={$p}
  >
    <Pagination.Content class="text-foreground">
      <Pagination.Item>
        <Pagination.PrevButton />
      </Pagination.Item>
      {#each pages as page (page.key)}
        {#if page.type === 'ellipsis'}
          <Pagination.Item>
            <Pagination.Ellipsis />
          </Pagination.Item>
        {:else}
          <Pagination.Item>
            <Pagination.Link {page} isActive={currentPage == page.value}>
              {page.value}
            </Pagination.Link>
          </Pagination.Item>
        {/if}
      {/each}
      <Pagination.Item>
        <Pagination.NextButton />
      </Pagination.Item>
    </Pagination.Content>
  </Pagination.Root>
</div>
