import { z } from 'zod';
import {
  AddressSchema,
  AttributesMetadataSchema,
  ExternalUrlSchema,
  ImageUrlSchema,
  type Address,
  BigNumberishSchema,
  type Hash,
  type EnsName
} from './common';
import { decodeDataJsonTokenURI } from '../helpers';
import { log } from '$lib/logger';
import type { ReadableContract, WritableContract } from '../viem';
import { getContract, parseEventLogs } from 'viem';
import { iProfileAbi } from '../generated/subsub';
import { isAddress } from '$lib/web3/helpers';

export type Profile = ReadableContract;

export interface WritableProfile extends Profile, WritableContract {}

const abi = iProfileAbi;

function contract(profile: Profile) {
  return getContract({
    abi,
    address: profile.address,
    client: profile.publicClient
  });
}

function writeableContract(profile: WritableProfile) {
  return getContract({
    abi,
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

export type OwnerData = Address | EnsName | ProfileData;

/**
 *  extracts a owner name to display
 *  @param addressTransform is applied to a raw address
 */
export function ownerName(data: OwnerData, addressTransform?: (addr: Address) => string): string {
  if (typeof data !== 'string') {
    // ProfileData
    return data.name;
  } else if (isAddress(data)) {
    return addressTransform ? addressTransform(data) : data;
  }
  // ens
  return data;
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

export async function findProfile(profile: Profile, tokenId: bigint): Promise<ProfileData | null> {
  const c = contract(profile);
  try {
    const encoded = await c.read.tokenURI([tokenId]);
    const metadata = decodeDataJsonTokenURI(encoded, ProfileTokenMetadataSchema);

    // TODO do multicall / on-chain
    const owner = await ownerOf(profile, tokenId);

    log.debug('Found profile', profile, tokenId, owner, metadata);

    return mapProfileData(profile, tokenId, metadata, owner);
  } catch (err) {
    log.warn('Failed to locate profile at', profile.address, tokenId, err);
    return null;
  }
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
    const [minted] = parseEventLogs({ abi, logs, eventName: 'Minted', args: { to: account } });
    if (!minted) {
      throw new Error('Transaction Log not found, did the transaction revert?');
    }
    return minted.args.tokenId;
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
