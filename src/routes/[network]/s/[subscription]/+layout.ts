import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { asChecksumAddress } from '$lib/web3/contracts/common';
import { isAddress } from '$lib/web3/helpers';

export const prerender = false;

export const load = (({ params }) => {
  const subAddr = params.subscription;

  if (!isAddress(subAddr)) {
    console.error(`Address invalid`, subAddr);
    error(400, `Address invalid: ${subAddr}`);
  }

  return {
    subscriptionAddr: asChecksumAddress(subAddr)
  };
}) satisfies LayoutLoad;
