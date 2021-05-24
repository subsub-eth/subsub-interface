import {
  IERC20
} from '../../../../types/web3-v1-contracts/IERC20';

import {Address} from "../types";

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
  allowance(owner: Address, spender: Address): Promise<string>

}

export class Web3IERC20 implements IERC20Wrapper {

  private delegate: IERC20;

  constructor(delegate: IERC20) {
    this.delegate = delegate;
  }

  async approve(spender: Address, onTransactionHash: (hash: string) => void): Promise<boolean> {
    const amount = "100000";

    return this.delegate.methods.approve(spender, amount).send()
    .once('transactionHash', onTransactionHash)
    .then(res => {
      // TODO error handling
      console.debug('received success', res);
      return true;
    });
  }

  async allowance(owner: Address, spender: Address): Promise<string> {
    // TODO cache
    return this.delegate.methods.allowance(owner, spender).call();
  }
}

