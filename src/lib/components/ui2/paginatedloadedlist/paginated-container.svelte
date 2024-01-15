<script lang="ts" generics="T">
  import { writable, derived } from 'svelte/store';

  import { log } from '$lib/logger';
  import { createQuery, keepPreviousData } from '@tanstack/svelte-query';

  /**
   * Load function that retrieves a list of items based on the page number
   */
  export let load: (page: number) => Promise<Array<T>>; /* eslint-disable-line no-undef */

  /**
   * query key for the cache
   */
  export let queryKey: string;

  /**
   * page to display
   */
  export let page: number;

  const p = writable(page);

  $: {
    p.set(page);
  }

  // we need to keep the query so it can find its previous data
  const list = createQuery(
    derived(p, (p) => ({
      queryKey: [queryKey, p],
      queryFn: async () => {
        log.debug('Loading page from list', p);
        return await load(p);
      },
      staleTime: 3 * 60 * 1000,
      placeholderData: keepPreviousData
    }))
  );

  $: items = $list.data!; // for the type!
</script>

{#if $list.isPending}
  <slot name="loading" />
{/if}
{#if $list.isError}
  <slot name="error" />
{/if}
{#if $list.isSuccess}
  <slot name="content" {items} isLoading={$list.isPlaceholderData}/>
{/if}
