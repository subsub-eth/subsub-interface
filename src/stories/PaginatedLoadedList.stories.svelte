<script lang="ts" context="module">
  import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query';
  import { PaginatedLoadedList } from '$lib/components/ui2/paginatedloadedlist';
  import { rangeArray, waitFor } from '$lib/helpers';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: true
      }
    }
  });

  const loadWithPageSize = (pageSize: number) => async (page: number) => {
    await waitFor(1000);
    return rangeArray(page * pageSize, (page + 1) * pageSize);
  };
  const pageSize = 5;
  const totalItems = 100;

  export const meta = {
    title: 'PaginatedLoadedList',
    component: PaginatedLoadedList,
    tags: ['autodocs'],
    args: {
      load: loadWithPageSize(pageSize),
      pageSize: pageSize,
      totalItems: totalItems
    },
    argTypes: {}
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import { cn } from '$lib/utils';
</script>

<Template let:args>
  <QueryClientProvider client={queryClient}>
    <PaginatedLoadedList {...args} let:items let:isLoading>
      {@const loading = isLoading ? 'text-red-500' : ''}
      {#each items as item}
        <div class={cn('text-xl font-bold text-foreground', loading)}>{item}</div>
      {/each}
      <div slot="error">Error</div>
      <div slot="loading">Loading</div>
    </PaginatedLoadedList>
  </QueryClientProvider>
</Template>

<Story name="Default" args={{}} />
