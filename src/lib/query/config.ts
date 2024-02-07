import { QueryClient, type CreateQueryResult } from '@tanstack/svelte-query';
import { browser } from '$app/environment';

export type QueryResult<T> = CreateQueryResult<T>

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: browser
    }
  }
});

// queryClient.setQueryDefaults

export const queryClient = qc;
