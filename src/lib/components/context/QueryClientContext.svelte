<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { queryClient } from '$lib/query/config';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<QueryClientProvider client={queryClient}>
  {@render children?.()}
</QueryClientProvider>
