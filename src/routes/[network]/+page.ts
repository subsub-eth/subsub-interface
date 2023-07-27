import { networks } from "$lib/routes-config";

export const prerender = true;

export const entries = () => {
  return networks;
};
