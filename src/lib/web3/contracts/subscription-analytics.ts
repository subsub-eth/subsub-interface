import type { ISubscriptionHandle } from '@createz/contracts/types/ethers-contracts';
import type { Address } from './common';
import type { SubscriptionContractData } from './subscription';

export type WarningMessage = {
  type: 'error' | 'warning' | 'paused';
  title: string;
  text: string;
};

export async function analyzeSubscriptionContract(
  subPlan: SubscriptionContractData
): Promise<Array<WarningMessage>> {
  const msgs: Array<WarningMessage> = [];

  if (subPlan.mintingPaused) {
    msgs.push({
      type: 'paused',
      title: 'Minting Paused',
      text: 'Plan does not allow minting new subscriptions'
    });
  }
  if (subPlan.renewalPaused) {
    msgs.push({
      type: 'paused',
      title: 'Renewal Paused',
      text: 'Plan does not allow renewing existing subscriptions'
    });
  }
  if (subPlan.tippingPaused) {
    msgs.push({ type: 'paused', title: 'Tipping Paused', text: 'Plan does not allow tipping' });
  }

  if (subPlan.lock > 1_000) {
    msgs.push({
      type: 'warning',
      title: 'Large toke lockup',
      text: 'Plan uses a higher that 10% token lockup on deposits'
    });
  }

  return msgs;
}

export async function isManaged(
  plan: Address,
  handle: ISubscriptionHandle
): Promise<Array<WarningMessage>> {
  const tokenId = BigInt(plan);
  const isManaged = await handle.isManaged(tokenId);

  if (isManaged) {
    return [
      {
        type: 'error',
        title: 'Plan unmanaged',
        text: 'Plan implementation is not managed by out team'
      }
    ];
  }
  return [];
}
