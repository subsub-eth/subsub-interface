import type { Hash } from '$lib/web3/contracts/common';
import type { PauseEvents, TxFailedEvents, UnpauseEvents } from '$lib/components/common-events';
export {TxFailedEvents};

export type ApprovalEvents = {
  approvalTxSubmitted: Hash;
  approved: [bigint, Hash];
};

export type MintEvents = {
  mintTxSubmitted: Hash;
  minted: [bigint, Hash];
};
export type MintSubscriptionEvents = MintEvents & ApprovalEvents & TxFailedEvents;

export type DepositEvents = {
  depositTxSubmitted: Hash;
  deposited: [bigint, Hash];
};

export type WithdrawalEvents = {
  withdrawTxSubmitted: Hash;
  withdrawn: [bigint, Hash];
};

export type DepositSubscriptionEvents = DepositEvents & ApprovalEvents & TxFailedEvents;

export type WithdrawSubscriptionEvents = WithdrawalEvents & TxFailedEvents;

export type PauseSubscriptionContractEvents = PauseEvents & TxFailedEvents;

export type UnpauseSubscriptionContractEvents = UnpauseEvents & TxFailedEvents;
