import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { log } from '$lib/logger';

export const prerender = false;

export const load = (({ params }) => {
  try {
    const tokenId = BigInt(params.tokenId);
    return {
      tokenId: tokenId
    };
  } catch (err) {
    log.error(`Invalid tokenId`, params.tokenId, err);
    error(404, `Invalid tokenId: ${params.tokenId}`);
  }
}) satisfies PageLoad;
