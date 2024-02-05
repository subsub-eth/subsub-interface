import { z } from 'zod';
import {
  AddressSchema,
  AttributesMetadataSchema,
  ExternalUrlSchema,
  ImageUrlSchema,
  type Address,
  BigNumberishSchema,
  type Hash
} from './common';
import type { Profile } from '@createz/contracts/types/ethers-contracts';
import { decodeDataJsonTokenURI } from '../helpers';
import type { EventDispatcher } from 'svelte';
import type { MintEvents } from '$lib/components/profile/action/profile-events';
import { findLog } from '../ethers';
import { log } from '$lib/logger';

export const ProfileTokenMetadataSchema = AttributesMetadataSchema.extend({});

export type ProfileTokenMetadata = z.infer<typeof ProfileTokenMetadataSchema>;

export const ProfileDataSchema = z.object({
  address: AddressSchema,
  tokenId: BigNumberishSchema,
  owner: AddressSchema,
  name: z.string().min(3, 'Name must be at least 3 chars'),
  description: z.string().optional(),
  image: ImageUrlSchema.catch(''),
  externalUrl: ExternalUrlSchema.catch('')
});

export type ProfileData = z.infer<typeof ProfileDataSchema>;

async function mapProfileData(
  contract: Profile,
  tokenId: bigint,
  metadata: ProfileTokenMetadata,
  owner: Address
): Promise<ProfileData> {
  return {
    address: AddressSchema.parse(await contract.getAddress()),
    tokenId: tokenId,
    owner: owner,
    name: metadata.name,
    description: metadata.description,
    image: metadata.image,
    externalUrl: metadata.external_url
  };
}

export async function countUserProfiles(contract: Profile, account: string): Promise<number> {
  log.debug('profile: ', contract);
  const count = await contract.balanceOf(account);
  return Number(count);
}

export async function totalSupply(contract: Profile): Promise<number> {
  const count = await contract.totalSupply();
  return Number(count);
}

export async function ownerOf(contract: Profile, tokenId: bigint): Promise<Address> {
  const owner = AddressSchema.parse(await contract.ownerOf(tokenId));
  return owner;
}

export async function findProfile(contract: Profile, tokenId: bigint): Promise<ProfileData> {
  const encoded = await contract.tokenURI(tokenId);
  const metadata = decodeDataJsonTokenURI(encoded, ProfileTokenMetadataSchema);

  // TODO do multicall / on-chain
  const owner = await ownerOf(contract, tokenId);

  log.debug('Found profile', contract, tokenId, owner, metadata);

  return mapProfileData(contract, tokenId, metadata, owner);
}

export type MintFunc = (
  name: string,
  description: string,
  image: string,
  externalUrl: string,
  events?: {
    onMintTxSubmitted?: (hash: Hash) => void,
  }
) => Promise<bigint>

export function mint(
  contract: Profile,
  account: string
): MintFunc {
  return async (
    name,
    description,
    image,
    externalUrl,
    events
  ): Promise<bigint> => {
    const tx = await contract.mint(name, description, image, externalUrl);
    events?.onMintTxSubmitted?.(tx.hash);
    const mintEvent = await findLog(tx, contract, contract.filters.Minted(account));
    if (!mintEvent) {
      throw new Error('Transaction Log not found');
    }
    const tokenId = mintEvent?.args.tokenId;

    return tokenId;
  };
}

export function listUserProfilesRev(
  contract: Profile,
  account: string,
  pageSize: number,
  totalItems: number
): (page: number) => Promise<Array<ProfileData>> {
  // TODO multicall
  const func = async (page: number): Promise<Array<ProfileData>> => {
    const owner = AddressSchema.parse(account);
    const index = page * pageSize;
    const size = Math.max(Math.min(totalItems - index, pageSize), 0);

    const load = async (i: number): Promise<ProfileData> => {
      // reverse index here
      const id = await contract.tokenOfOwnerByIndex(owner, totalItems - 1 - (i + index));
      const encoded = await contract.tokenURI(id);
      const data = decodeDataJsonTokenURI(encoded, ProfileTokenMetadataSchema);
      return mapProfileData(contract, id, data, owner);
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
): (page: number) => Promise<Array<ProfileData>> {
  // TODO multicall
  const func = async (page: number): Promise<Array<ProfileData>> => {
    const index = page * pageSize;
    const size = Math.max(Math.min(totalItems - index, pageSize), 0);

    const load = async (i: number): Promise<ProfileData> => {
      // reverse index here
      const id = await contract.tokenByIndex(totalItems - 1 - (i + index));
      const owner = AddressSchema.parse(await contract.ownerOf(id));
      const encoded = await contract.tokenURI(id);
      const data = decodeDataJsonTokenURI(encoded, ProfileTokenMetadataSchema);
      return mapProfileData(contract, id, data, owner);
    };

    const data = [...Array(size).keys()].map((i) => load(i));
    return Promise.all(data);
  };

  return func;
}
