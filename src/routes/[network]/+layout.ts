import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

import { chainNames } from '$lib/chain-config';

export const load = (({ params }) => {
  const network = params.network;

  if (!chainNames.includes(network)) {
    error(404, `Unknown network '${network}'`);
  }

  return {
    network: network
  };
}) satisfies PageLoad;
