import type { ERC20 } from '@createz/contracts/types/ethers-contracts';
import type { EventDispatcher } from 'svelte';
import type { Hash } from './common';


export type ApprovalEvents = {
  approvalTxSubmitted: Hash;
  approved: [bigint, Hash];
};

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
