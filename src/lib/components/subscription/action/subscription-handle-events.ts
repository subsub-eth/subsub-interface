import type { Address, Hash } from '$lib/web3/contracts/common';
import type { OnTx, TxFailedEvents } from '$lib/components/common-events';
export type { TxFailedEvents };

export type CreateEvents = {
  onCreateTxSubmitted?: OnTx;
  onCreated?: (address: Address, tx: Hash) => void;
};

export type CreateSubscriptionContractEvents = CreateEvents & TxFailedEvents;
