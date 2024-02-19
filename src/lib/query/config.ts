import { QueryClient, type CreateQueryResult, type QueryObserverResult } from '@tanstack/svelte-query';
import { browser } from '$app/environment';

export type QueryResult<T> = CreateQueryResult<T>
export type ObservedQueryResult<T> = QueryObserverResult<T>

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: browser
    }
  }
});

// queryClient.setQueryDefaults

export const queryClient = qc;
