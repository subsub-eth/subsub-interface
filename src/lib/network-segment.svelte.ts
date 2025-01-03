import { page } from '$app/state';
import { derived, toStore, type Readable } from 'svelte/store';
import { log } from '$lib/logger';

const paramsStore = toStore(() => page.params);

/**
 * exposed network segment as store to find the correct chain
 */
export const networkSegment: Readable<string | undefined> = derived(paramsStore, (params) => {
  log.debug(`Extracting navigation segment from page params`, params);
  const network = params?.network;
  log.debug(`network segment is`, network);
  return network;
});
