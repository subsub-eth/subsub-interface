<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { queryClient } from '$lib/query/config';
</script>

<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>
