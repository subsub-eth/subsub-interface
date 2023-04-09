import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

import { chainNames } from '$lib/web3/chains';

export const load = (({ params }) => {
  const network = params.network;

  if (!chainNames.includes(network)) {
    throw error(404, `Unknown network '${network}'`);
  }

  return {
    network: network
  };
}) satisfies PageLoad;
