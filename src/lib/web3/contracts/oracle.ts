// https://reference-data-directory.vercel.app/feeds-matic-testnet.json

import type { PriceFeeds } from '$lib/chain-config';
import type { Signer } from 'ethers';
import type { Address } from './common';
import { AggregatorV3Interface__factory } from '@createz/contracts/types/ethers-contracts';
import { log } from '$lib/logger';

/**
 * tuple of price in USD as an integer and the number of decimals
 */
export type Price = {
  price: bigint;
  decimals: number;
};

export async function findPrice(
  asset: Address,
  priceFeeds: PriceFeeds,
  signer: Signer
): Promise<Price | undefined> {
  const feedAddr = priceFeeds[asset];
  if (!feedAddr) {
    log.debug('Matching price feed not found in local registry', asset, priceFeeds);
    return undefined;
  }

  const feed = AggregatorV3Interface__factory.connect(feedAddr, signer);

  log.debug('Query price feed', feed, asset);

  const decimals = Number(await feed.decimals());
  const { answer } = await feed.latestRoundData();

  log.debug('Found price for asset', asset, answer, decimals);

  return {
    price: answer,
    decimals: decimals
  };
}
