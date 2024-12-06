<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { PaginatedLoadedList } from '$lib/components/ui2/paginatedloadedlist';
  import { rangeArray, waitFor } from '$lib/helpers';

  const loadWithPageSize = (pageSize: number) => async (page: number) => {
    await waitFor(1000);
    return rangeArray(page * pageSize, (page + 1) * pageSize);
  };
  const pageSize = 5;
  const totalItems = 100;

  const { Story } = defineMeta({
    title: 'PaginatedLoadedList',
    component: PaginatedLoadedList,
    tags: ['autodocs'],
    args: {
      load: loadWithPageSize(pageSize),
      pageSize: pageSize,
      totalItems: totalItems
    },
    argTypes: {}
  });
</script>

<script lang="ts">
  import { cn } from '$lib/utils';
  import QueryClientContext from '$lib/components/context/QueryClientContext.svelte';
</script>

<Story name="Default" args={{}}>
  {#snippet children(args)}
    <QueryClientContext>
      <PaginatedLoadedList {...args}>
        {#snippet children({ items, isLoading })}
          {@const loading = isLoading ? 'text-red-500' : ''}
          {#each items as item}
            <div class={cn('text-xl font-bold text-foreground', loading)}>{item}</div>
          {/each}
        {/snippet}
        {#snippet error()}
          <div>Error</div>
        {/snippet}
        {#snippet loading()}
          <div>Loading</div>
        {/snippet}
      </PaginatedLoadedList>
    </QueryClientContext>
  {/snippet}
</Story>
