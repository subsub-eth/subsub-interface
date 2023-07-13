import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { ethers } from 'ethers';

export const prerender = false;

export const load = (({ params }) => {
  const subAddr = params.subscription;

  if (!ethers.isAddress(subAddr)) {
    console.error(`Address invalid`, subAddr);
    throw error(400, `Address invalid: ${subAddr}`);
  }

  return {
    subscriptionAddr: subAddr
  };
}) satisfies LayoutLoad;
