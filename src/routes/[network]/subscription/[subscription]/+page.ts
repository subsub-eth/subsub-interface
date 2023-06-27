import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { ethers } from 'ethers';

export const prerender = false;

export const load = (({ params }) => {
  const subAddr = params.subscription;

  if (!ethers.isAddress(subAddr)) {
    console.error(`Address invalid`, subAddr);
    throw error(403, `Address invalid: ${subAddr}`);
  }

  return {
    subscriptionAddr: subAddr
  };
}) satisfies PageLoad;
