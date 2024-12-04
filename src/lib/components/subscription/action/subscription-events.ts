import type { Hash } from '$lib/web3/contracts/common';
import type { TxFailedEvents, OnTx } from '$lib/components/common-events';
export { type TxFailedEvents };

export type ApprovalEvents = {
  onApprovalTxSubmitted?: OnTx;
  onApproved?: (amount: bigint, tx: Hash) => void;
};

export type MintEvents = {
  onMintTxSubmitted?: OnTx;
  onMinted?: (id: bigint, tx: Hash) => void;
};
export type MintSubscriptionEvents = MintEvents & ApprovalEvents & TxFailedEvents;

export type DepositEvents = {
  onDepositTxSubmitted?: OnTx;
  onDeposited?: (amount: bigint, tx: Hash) => void;
};

export type WithdrawalEvents = {
  onWithdrawTxSubmitted?: OnTx;
  onWithdrawn?: (amount: bigint, tx: Hash) => void;
};

export type ClaimEvents = {
  onClaimTxSubmitted?: OnTx;
  onClaimed?: (amount: bigint, tx: Hash) => void;
};

export type FlagsChangeEvents = {
  onFlagsTxSubmitted?: OnTx;
  onFlagsChanged?: OnTx;
};

export type DescriptionChangeEvents = {
  onDescriptionTxSubmitted?: OnTx;
  onDescriptionChanged?: OnTx;
};

export type ImageChangeEvents = {
  onImageTxSubmitted?: OnTx;
  onImageChanged?: OnTx;
};

export type ExternalUrlChangeEvents = {
  onExternalUrlTxSubmitted?: OnTx;
  onExternalUrlChanged?: OnTx;
};

export type DepositSubscriptionEvents = DepositEvents & ApprovalEvents & TxFailedEvents;

export type WithdrawSubscriptionEvents = WithdrawalEvents & TxFailedEvents;

export type ClaimSubscriptionContractEvents = ClaimEvents & TxFailedEvents;

export type FlagsChangeContractEvents = FlagsChangeEvents & TxFailedEvents;

export type MetadataChangeContractEvents = DescriptionChangeEvents &
  ImageChangeEvents &
  ExternalUrlChangeEvents &
  TxFailedEvents;
