import { error } from "@sveltejs/kit";
import type { PageLoad } from './$types';

export const load = (({ params }) => {
  let network = params.network;

  if ('polygon' != network) {
    throw error(404, "Unknown network");
  }

  return {
    network: network,
  };
}) satisfies PageLoad;
