<script lang="ts" generics="T">
  import * as Pagination from '$lib/components/ui/pagination';
  import { type Snippet } from 'svelte';

  interface Props<T> {
    /**
     * items to manage in this list
     */
    items: T[];
    /**
     * page to display
     */
    page?: number;
    /**
     * number of items per page
     */
    pageSize: number;
    // TODO FIXME types
    children?: Snippet<[any]>;
  }

  let { items, page = 1, pageSize, children }: Props<T> = $props();

  let p = $state(page)

  let totalItems = $derived(items.length);

  let currentItems = $derived(items.slice((p - 1) * pageSize, p * pageSize));
</script>

<div>
  <div>
    {@render children?.({ currentItems })}
  </div>
  <Pagination.Root count={totalItems == 0 ? 1 : totalItems} perPage={pageSize} bind:page={p}>
    {#snippet children({ pages, currentPage })}
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
    {/snippet}
  </Pagination.Root>
</div>
