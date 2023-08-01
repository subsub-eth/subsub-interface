import type { ERC20 } from '@createz/contracts/types/ethers-contracts';
import type { EventDispatcher } from 'svelte';
export type Hash = string;

export type ApprovalEvents = {
  approvalTxSubmitted: Hash;
  approved: [bigint, Hash];
};

export type TxFailedEvents = {
  txFailed: unknown;
};

export type MintSubscriptionEvents = {
  mintTxSubmitted: Hash;
  minted: [bigint, Hash];
} & ApprovalEvents &
  TxFailedEvents;

export type DepositEvents = {
  depositTxSubmitted: Hash;
  deposited: [bigint, Hash];
}

export type WithdrawalEvents = {
  withdrawTxSubmitted: Hash;
  withdrawn: [bigint, Hash];
}

export type DepositSubscriptionEvents = DepositEvents & ApprovalEvents &
  TxFailedEvents;


export type WithdrawSubscriptionEvents = WithdrawalEvents & TxFailedEvents;

export function approveFunc(token: ERC20, spender: string) {
  return async (amount: bigint, dispatch: EventDispatcher<ApprovalEvents>): Promise<bigint> => {
    if (amount > 0 && token) {
      const apprTx = await token.approve(spender, amount);
      dispatch('approvalTxSubmitted', apprTx.hash);
      const receipt = await apprTx.wait();
      dispatch('approved', [amount, receipt?.hash ?? apprTx.hash]);
      return amount;
    } else {
      throw new Error('Approval of 0 amount or token not found');
    }
  };
}
