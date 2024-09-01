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
import { decodeDataJsonTokenURI } from '../helpers';
import { log } from '$lib/logger';
import type { ReadableContract, WritableContract } from '../viem';
import { decodeEventLog, getContract } from 'viem';
import { iProfileAbi } from '../generated/createz';

export interface Profile extends ReadableContract {}

export interface WritableProfile extends Profile, WritableContract {}

function contract(profile: Profile) {
  return getContract({
    abi: iProfileAbi,
    address: profile.address,
    client: profile.publicClient
  });
}

function writeableContract(profile: WritableProfile) {
  return getContract({
    abi: iProfileAbi,
    address: profile.address,
    client: { public: profile.publicClient, wallet: profile.walletClient }
  });
}

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
    address: contract.address,
    tokenId: tokenId,
    owner: owner,
    name: metadata.name,
    description: metadata.description,
    image: metadata.image,
    externalUrl: metadata.external_url
  };
}

export async function countUserProfiles(profile: Profile, account: Address): Promise<number> {
  log.debug('profile: ', profile);
  const count = await contract(profile).read.balanceOf([account]);
  return Number(count);
}

export async function totalSupply(profile: Profile): Promise<number> {
  const count = await contract(profile).read.totalSupply();
  return Number(count);
}

export async function ownerOf(profile: Profile, tokenId: bigint): Promise<Address> {
  const owner = await contract(profile).read.ownerOf([tokenId]);
  return owner;
}

export async function findProfile(profile: Profile, tokenId: bigint): Promise<ProfileData> {
  const c = contract(profile);
  const encoded = await c.read.tokenURI([tokenId]);
  const metadata = decodeDataJsonTokenURI(encoded, ProfileTokenMetadataSchema);

  // TODO do multicall / on-chain
  const owner = await ownerOf(profile, tokenId);

  log.debug('Found profile', profile, tokenId, owner, metadata);

  return mapProfileData(profile, tokenId, metadata, owner);
}

export type MintFunc = (
  name: string,
  description: string,
  image: string,
  externalUrl: string,
  events?: {
    onMintTxSubmitted?: (hash: Hash) => void;
  }
) => Promise<bigint>;

export function mint(profile: WritableProfile, account: Address): MintFunc {
  return async (name, description, image, externalUrl, events): Promise<bigint> => {
    const c = writeableContract(profile);
    const tx = await c.write.mint([name, description, image, externalUrl]);

    events?.onMintTxSubmitted?.(tx);

    const { logs } = await profile.publicClient.waitForTransactionReceipt({ hash: tx });
    // TODO refactor boilerplate code
    const [tokenId] = logs
      .map((l) =>
        decodeEventLog({
          abi: iProfileAbi,
          topics: l.topics,
          data: l.data,
          strict: false
        })
      )
      .filter((l) => l.eventName === 'Minted' && l.args.to === account)
      .map((l) => (l.eventName === 'Minted' ? l.args.tokenId : undefined));

    if (!tokenId) {
      throw new Error('Transaction Log not found, did the transaction revert?');
    }
    return tokenId;
  };
}

export function listUserProfilesRev(
  profile: Profile,
  account: string,
  pageSize: number,
  totalItems: number
): (page: number) => Promise<Array<ProfileData>> {
  // TODO multicall
  const func = async (page: number): Promise<Array<ProfileData>> => {
    const owner = AddressSchema.parse(account);
    const index = page * pageSize;
    const size = Math.max(Math.min(totalItems - index, pageSize), 0);
    const c = contract(profile);

    const load = async (i: number): Promise<ProfileData> => {
      // reverse index here
      const id = await c.read.tokenOfOwnerByIndex([owner, BigInt(totalItems - 1 - (i + index))]);
      const encoded = await c.read.tokenURI([id]);
      const data = decodeDataJsonTokenURI(encoded, ProfileTokenMetadataSchema);
      return mapProfileData(profile, id, data, owner);
    };

    const data = [...Array(size).keys()].map((i) => load(i));
    return Promise.all(data);
  };

  return func;
}

export function listAllProfilesRev(
  profile: Profile,
  pageSize: number,
  totalItems: number
): (page: number) => Promise<Array<ProfileData>> {
  // TODO multicall
  const func = async (page: number): Promise<Array<ProfileData>> => {
    const index = page * pageSize;
    const size = Math.max(Math.min(totalItems - index, pageSize), 0);
    const c = contract(profile);

    const load = async (i: number): Promise<ProfileData> => {
      // reverse index here
      const id = await c.read.tokenByIndex([BigInt(totalItems - 1 - (i + index))]);
      const owner = AddressSchema.parse(await c.read.ownerOf([id]));
      const encoded = await c.read.tokenURI([id]);
      const data = decodeDataJsonTokenURI(encoded, ProfileTokenMetadataSchema);
      return mapProfileData(profile, id, data, owner);
    };

    const data = [...Array(size).keys()].map((i) => load(i));
    return Promise.all(data);
  };

  return func;
}
