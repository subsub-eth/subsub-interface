import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { ethers } from 'ethers';
import { asChecksumAddress } from '$lib/web3/contracts/common';

export const prerender = false;

export const load = (({ params }) => {
  const subAddr = params.subscription;

  if (!ethers.isAddress(subAddr)) {
    console.error(`Address invalid`, subAddr);
    error(400, `Address invalid: ${subAddr}`);
  }

  return {
    subscriptionAddr: asChecksumAddress(subAddr)
  };
}) satisfies LayoutLoad;
