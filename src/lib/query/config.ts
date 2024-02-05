import { QueryClient } from '@tanstack/svelte-query';
import { browser } from '$app/environment';

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: browser
    }
  }
});

// queryClient.setQueryDefaults

export const queryClient = qc;
