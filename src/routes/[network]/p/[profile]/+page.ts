import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = false;

export const load = (({ params }) => {
  try {
    const tokenId = BigInt(params.profile);
    return {
      profile: tokenId
    };
  } catch (err) {
    console.error(`Invalid Profile Id`, params.profile);
    throw error(404, `Invalid Profile Id: ${params.profile}`);
  }
}) satisfies PageLoad;
