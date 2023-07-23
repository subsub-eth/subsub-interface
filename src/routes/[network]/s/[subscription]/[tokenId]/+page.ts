import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = false;

export const load = (({ params }) => {
  try {
    const tokenId = BigInt(params.tokenId);
    return {
      tokenId: tokenId
    };
  } catch (err) {
    console.error(`Invalid tokenId`, params.tokenId);
    throw error(404, `Invalid tokenId: ${params.tokenId}`);
  }
}) satisfies PageLoad;
