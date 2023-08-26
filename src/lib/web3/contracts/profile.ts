import { z } from 'zod';
import { AttributesMetadataSchema } from './common';
import type { Profile } from '@createz/contracts/types/ethers-contracts';
import { decodeDataJsonTokenURI } from '../helpers';
import type { EventDispatcher } from 'svelte';
import type { MintEvents } from '$lib/components/profile/action/profile-events';
import { findLog } from '../ethers';

export const ProfileTokenMetadataSchema = AttributesMetadataSchema.extend({});

export type ProfileTokenMetadata = z.infer<typeof ProfileTokenMetadataSchema>;

export async function countUserProfiles(contract: Profile, account: string): Promise<number> {
  const count = await contract.balanceOf(account);
  return Number(count);
}

export async function totalSupply(contract: Profile): Promise<number> {
  const count = await contract.totalSupply();
  return Number(count);
}

export function mint(
  contract: Profile,
  account: string
): (
  name: string,
  description: string,
  image: string,
  externalUrl: string,
  dispatch: EventDispatcher<MintEvents>
) => Promise<bigint> {
  return async (
    name: string,
    description: string,
    image: string,
    externalUrl: string,
    dispatch: EventDispatcher<MintEvents>
  ): Promise<bigint> => {
    const tx = await contract.mint(name, description, image, externalUrl);
    dispatch('mintTxSubmitted', tx.hash);
    const mintEvent = await findLog(tx, contract, contract.filters.Minted(account));
    if (!mintEvent) {
      throw new Error('Transaction Log not found');
    }
    const tokenId = mintEvent?.args.tokenId;
    dispatch('minted', [tokenId, tx.hash]);

    return tokenId;
  };
}

export function listUserProfilesRev(
  contract: Profile,
  account: string,
  pageSize: number,
  totalItems: number
): (page: number) => Promise<[bigint, ProfileTokenMetadata][]> {
  // TODO multicall
  const func = async (page: number): Promise<[bigint, ProfileTokenMetadata][]> => {
    const index = page * pageSize;
    const size = Math.max(Math.min(totalItems - index, pageSize), 0);

    const load = async (i: number): Promise<[bigint, ProfileTokenMetadata]> => {
      // reverse index here
      const id = await contract.tokenOfOwnerByIndex(account, totalItems - 1 - (i + index));
      const encoded = await contract.tokenURI(id);
      const data = decodeDataJsonTokenURI<ProfileTokenMetadata>(encoded);
      return [id, data];
    };

    const data = [...Array(size).keys()].map((i) => load(i));
    return Promise.all(data);
  };

  return func;
}

export function listAllProfilesRev(
  contract: Profile,
  pageSize: number,
  totalItems: number
): (page: number) => Promise<[bigint, ProfileTokenMetadata][]> {
  // TODO multicall
  const func = async (page: number): Promise<[bigint, ProfileTokenMetadata][]> => {
    const index = page * pageSize;
    const size = Math.max(Math.min(totalItems - index, pageSize), 0);

    const load = async (i: number): Promise<[bigint, ProfileTokenMetadata]> => {
      // reverse index here
      const id = await contract.tokenByIndex(totalItems - 1 - (i + index));
      const encoded = await contract.tokenURI(id);
      const data = decodeDataJsonTokenURI<ProfileTokenMetadata>(encoded);
      return [id, data];
    };

    const data = [...Array(size).keys()].map((i) => load(i));
    return Promise.all(data);
  };

  return func;
}
