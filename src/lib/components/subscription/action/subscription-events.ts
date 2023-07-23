import type { ERC20, Subscription } from '@createz/contracts/types/ethers-contracts';
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

export type DepositSubscriptionEvents = DepositEvents & ApprovalEvents &
  TxFailedEvents;


export type WithdrawSubscriptionEvents = {
  withdrawTxSubmitted: string;
  withdrawn: bigint;
} & TxFailedEvents;

export type CancelSubscriptionEvents = {
  cancelTxSubmitted: string;
  canceled: bigint;
} & TxFailedEvents;

export type DispatchFunc<EventMap extends object = any> = {
  <EventKey extends Extract<keyof EventMap, string>>(
    type: EventKey,
    detail?: EventMap[EventKey]
  ): boolean;
};

export type ApprovalDispatch = DispatchFunc<ApprovalEvents>;
export type DepositDispatch = DispatchFunc<DepositEvents>;

export function approveFunc(token: ERC20, spender: string) {
  return async (amount: bigint, dispatch: ApprovalDispatch): Promise<bigint> => {
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
