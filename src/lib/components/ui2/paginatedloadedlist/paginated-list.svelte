<script lang="ts" generics="T">
  import { run } from 'svelte/legacy';

  import { LIST } from '$lib/query/keys';

  import { writable, derived as derivedStore } from 'svelte/store';
  import { log } from '$lib/logger';
  import { createQuery, keepPreviousData } from '@tanstack/svelte-query';

  import * as Pagination from '$lib/components/ui/pagination';

  interface Props<T> {
    /**
     * Load function that retrieves a list of items based on the page number
     */
    load: (page: number) => Promise<Array<T>>;
    /**
     * page to display
     */
    page?: number;
    /**
     * total number of items in result set
     */
    totalItems: number;
    /**
     * number of items per page
     */
    pageSize: number;
    /**
     * query key for the cache
     */
    queryKeys?: string[];
    loading?: import('svelte').Snippet;
    error?: import('svelte').Snippet;
    children?: import('svelte').Snippet<[{ items: T[]; isLoading: boolean }]>;
  }

  let {
    load,
    page = 1,
    totalItems,
    pageSize,
    queryKeys = [],
    loading,
    error,
    children
    // eslint-disable-next-line no-undef
  }: Props<T> = $props();

  const p = writable(page);

  run(() => {
    p.set(page);
  });

  // we need to keep the query so it can find its previous data
  const list = createQuery(
    derivedStore(p, (p) => {
      // convert to 0 based calls
      const page = p - 1;
      return {
        queryKey: queryKeys.concat([LIST, String(page)]),
        queryFn: async () => {
          log.debug('Loading page from list', page);
          try {
            return await load(page);
          } catch (err) {
            log.error('Loading paged data failed', page, err);
            throw err;
          }
        },
        staleTime: 3 * 60 * 1000,
        placeholderData: keepPreviousData
      };
    })
  );

  let items = $derived($list.data!); // for the type!
</script>

<div>
  <div>
    {#if $list.isPending}
      {#if loading}{@render loading()}{:else}Loading list data{/if}
    {/if}
    {#if $list.isError}
      {#if error}{@render error()}{:else}
        Failed to load list: {$list.error.message}
      {/if}
    {/if}
    {#if $list.isSuccess}
      {@render children?.({ items, isLoading: $list.isPlaceholderData })}
    {/if}
  </div>
  <Pagination.Root count={totalItems == 0 ? 1 : totalItems} perPage={pageSize} bind:page={$p}>
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
