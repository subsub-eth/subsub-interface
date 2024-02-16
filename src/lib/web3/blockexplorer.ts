import type { Address } from './contracts/common';

const ADDRESS = 'address';
const TOKEN = 'token';
const NFT = 'nft';

/**
 * Creates an explorer url to an address
 * @param explorerUrl base url of the block explorer
 * @param address on-chain address
 */
export function addressUrl(explorerUrl: string, address: Address): string {
  const url = new URL(explorerUrl);

  url.pathname = [ADDRESS, address].join('/');

  return url.toString();
}

/**
 * Creates an explorer url to a token contract
 * @param explorerUrl base url of the block explorer
 * @param address on-chain contract address
 */
export function tokenUrl(explorerUrl: string, address: Address): string {
  const url = new URL(explorerUrl);

  url.pathname = [TOKEN, address].join('/');

  return url.toString();
}

/**
 * Create an explorer url to a specific NFT token
 * @param explorerUrl base url of the block explorer
 * @param contract NFT contract address
 * @param tokenId id of the NFT
 */
export function nftUrl(explorerUrl: string, contract: Address, tokenId: bigint): string {
  const url = new URL(explorerUrl);

  url.pathname = [NFT, contract, tokenId.toString()].join('/');

  return url.toString();
}
