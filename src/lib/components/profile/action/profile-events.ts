import type { Hash } from '$lib/web3/contracts/common';
import type { TxFailedEvents } from '$lib/components/common-events';

export type MintEvents = {
  mintTxSubmitted: Hash;
  minted: bigint;
};

export type MintProfileEvents = MintEvents & TxFailedEvents;
