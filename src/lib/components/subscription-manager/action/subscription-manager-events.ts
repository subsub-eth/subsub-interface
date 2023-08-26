import type { Hash } from '$lib/web3/contracts/common';
import type { TxFailedEvents } from '$lib/components/common-events';
export {TxFailedEvents};

export type CreateEvents = {
  createTxSubmitted: Hash;
  created: [string, Hash];
};

export type CreateSubscriptionContractEvents = CreateEvents & TxFailedEvents;
