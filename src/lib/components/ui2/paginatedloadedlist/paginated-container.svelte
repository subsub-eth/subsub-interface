<script lang="ts" generics="T">
  import { createQuery } from '@tanstack/svelte-query';


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

  const list = createQuery({
    queryKey: [queryKey, page],
    queryFn: async () => await load(page)
  });

  $: items = $list.data! // for the type!
</script>

{#if $list.isPending}
  <slot name="loading" />
{/if}
{#if $list.isError}
  <slot name="error" />
{/if}
{#if $list.isFetched}
  <slot name="content" items={items}/>
{/if}
