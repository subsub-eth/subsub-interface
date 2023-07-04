import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load = (({ params }) => {
  const creator = params.creator;

  try {
    const id = BigInt(creator);
    return {
      creator: id
    };
  } catch (err) {
    console.error(`Token id invalid`, creator, err);
    throw error(403, `Token id invalid: ${creator}`);
  }
}) satisfies LayoutLoad;
