import { prettyNumber } from '$lib/helpers';
import type { ObservedQueryResult } from '$lib/query/config';
import type { OwnerData } from '$lib/query/subscription-queries';
import type { Erc20Data } from '$lib/web3/contracts/erc20';
import type { Price } from '$lib/web3/contracts/oracle';
import {
  activeSubscriptions,
  monthlyRate,
  type SubscriptionContractData
} from '$lib/web3/contracts/subscription';
import type { WarningMessage } from '$lib/web3/contracts/subscription-analytics';
import { formatEther } from '$lib/web3/helpers';

export type BaseProps = {
  /**
   * Data of the subscription plan
   */
  contractData: SubscriptionContractData;

  /**
   * Payment token data
   */
  paymentTokenData: Erc20Data;

  /**
   * Loads price of payment token
   */
  tokenPrice: ObservedQueryResult<Price | null>;

  /**
   * Loads the owner of this subscription
   */
  owner?: ObservedQueryResult<OwnerData>;

  /**
   * Warnings about the subscription plan
   */
  warnings: ObservedQueryResult<Array<WarningMessage>>;
};

export function baseValues({ contractData }: Pick<BaseProps, 'contractData'>) {
  const rawRate = monthlyRate(BigInt(contractData.rate));
  const rate = prettyNumber(Number(formatEther(rawRate)));

  // for simplicity: convert active subs but max out at totalSupply
  const totalSupply = Number(contractData.totalSupply);
  const activeSubs = activeSubscriptions(BigInt(contractData.activeShares), totalSupply);

  return { rawRate, rate, totalSupply, activeSubs };
}
