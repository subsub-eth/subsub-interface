import type { OnTx, TxFailedEvents } from '$lib/components/common-events';

export type MintEvents = {
  onMintTxSubmitted?: OnTx;
  onMinted?: (tokenId: bigint) => void;
};

export type MintProfileEvents = MintEvents & TxFailedEvents;
