import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { log } from '$lib/logger';

export const prerender = false;

export const load = (({ params }) => {
  try {
    const tokenId = BigInt(params.profile);
    return {
      profile: tokenId
    };
  } catch (err) {
    log.error(`Invalid Profile Id`, params.profile, err);
    error(404, `Invalid Profile Id: ${params.profile}`);
  }
}) satisfies PageLoad;
