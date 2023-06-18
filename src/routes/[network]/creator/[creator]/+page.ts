import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (({ params, parent }) => {
  const creator = params.creator;

  try {
    const id = BigInt(creator);
  } catch (err) {
    console.error(`Token id invalid`, creator, err);
    throw error(403, `Token id invalid: ${creator}`);
  }

  return {
    creator: creator
  };
}) satisfies PageLoad;
