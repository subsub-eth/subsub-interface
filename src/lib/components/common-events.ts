import type { Hash } from '$lib/web3/contracts/common';

export type TxFailedEvents = {
  onTxFailed?: (error?: unknown) => void;
};

export type OnTx = (tx: Hash) => void;
