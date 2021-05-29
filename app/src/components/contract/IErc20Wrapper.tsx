import {
  IERC20
} from '../../../../types/web3-v1-contracts/IERC20';

import {Address} from "../types";

import BN from "bn.js";
import {bn, maxUint} from "../util";

/**
  * Provides abstraction on top of a ERC20 Token
  */
export interface IERC20Wrapper {

  /**
    * approve an address to spend on behalf of user
    */
  approve(spender: Address, onTransactionHash: (hash: string) => void): Promise<boolean>

  /**
    * allowance
    */
  allowance(owner: Address, spender: Address): Promise<BN>

}

export class Web3IERC20 implements IERC20Wrapper {

  private delegate: IERC20;

  constructor(delegate: IERC20) {
    this.delegate = delegate;
  }

  async approve(spender: Address, onTransactionHash: (hash: string) => void): Promise<boolean> {
    const amount = maxUint;

    console.debug(`Approving token amount`, amount, amount.toString());

    return this.delegate.methods.approve(spender, amount).send()
      .once('transactionHash', onTransactionHash)
      .then(res => {
        // TODO error handling
        console.debug('received success', res);
        return true;
      });
  }

  async allowance(owner: Address, spender: Address): Promise<BN> {
    const allowance =
      await this.delegate.methods.allowance(owner, spender).call()
        .then(bn);

    console.debug(`Spender ${spender}'s allowance of user ${owner}'s tokens is ${allowance.toString()}`,
                  this.delegate);
    return allowance;
  }
}

