import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

import { chainNames } from '$lib/chain-config';

export const load: LayoutLoad = ({ params }) => {
  const network = params.network;

  if (!chainNames.find((c) => `${c}` === network)) {
    error(404, `Unknown network '${network}'`);
  }

  return {
    network: network
  };
};
