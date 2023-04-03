import { error } from "@sveltejs/kit";
import type { PageLoad } from './$types';
 
export const load = (({ params, parent }) => {
  let creator = params.creator;

  return {
    creator: creator
  };
}) satisfies PageLoad;
