<script lang="ts" generics="T">
  import Container from './paginated-container.svelte';
  import * as Pagination from '$lib/components/ui/pagination';

  interface $$Slots /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
    default: {
      items: Array<T> /* eslint-disable-line no-undef */;
    };
    loading: Record<string, never>;
    error: Record<string, never>;
  }
  /**
   * Load function that retrieves a list of items based on the page number
   */
  export let load: (page: number) => Promise<Array<T>>; /* eslint-disable-line no-undef */

  /**
   * total number of items in result set
   */
  export let totalItems: number;

  /**
   * number of items per page
   */
  export let pageSize: number;

  /**
   * query key for the cache
   */
  export let queryKey: string = 'list';
</script>

<Pagination.Root count={totalItems} perPage={pageSize} let:pages let:currentPage>
  {@const currPage = currentPage ? currentPage : 1}
  <Container {load} {queryKey} page={currPage - 1}>
    <slot name="loading" slot="loading" />
    <slot name="error" slot="error" />
    <slot slot="content" let:items {items} />
  </Container>
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
        <Pagination.Item isVisible={currentPage == page.value}>
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
