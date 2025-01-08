<script lang="ts" module>
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import { type Props } from '$lib/components/ui2/paginatedloadedlist/paginated-list.svelte';
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
  import { type Component } from 'svelte';

  // @ts-expect-error load function might be undefined due to Partial<>
  setTemplate<Component<Props<number>>>(template);
</script>

{#snippet template(args: Props<number>)}
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

<Story name="Default" args={{}} />

<Story name="No items" args={{ totalItems: 0, load: async () => [], queryKeys: ['none'] }} />

<Story name="Few items" args={{ totalItems: 3, load: async () => [1, 2, 3], queryKeys: ['few'] }} />
