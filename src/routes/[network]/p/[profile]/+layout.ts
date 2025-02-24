import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params }) => {
  const profile = params.profile;

  try {
    const id = BigInt(profile);
    return {
      profile: id
    };
  } catch (err) {
    console.error(`Token id invalid`, profile, err);
    error(403, `Token id invalid: ${profile}`);
  }
};
