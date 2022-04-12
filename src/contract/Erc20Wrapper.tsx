import {
  ERC20
} from '@createz/contracts/types/web3-v1-contracts/ERC20';

import {Address} from "../helper/types";

import BN from "bn.js";
import {bn, maxUint} from "../helper/util";

export interface ERC20Token {
  readonly address: Address;
  readonly name: string;
  readonly symbol: string;
  readonly decimals: number;
}
/**
  * Provides abstraction on top of a ERC20 Token
  */
export interface ERC20Wrapper extends ERC20Service {
}

export interface ERC20Service {

  getValues(): Promise<ERC20Token>;
  /**
    * approve an address to spend on behalf of user
    */
  approve(spender: Address, onTransactionHash: (hash: string) => void): Promise<boolean>

  /**
    * allowance
    */
  allowance(owner: Address, spender: Address): Promise<BN>

  /**
    * a user's balance
    */
  balanceOf(owner: Address): Promise<BN>
}

export class Web3ERC20 implements ERC20Wrapper {

  private delegate: () => ERC20;

  constructor(delegate: () => ERC20) {
    this.delegate = delegate;
  }

  async getValues(): Promise<ERC20Token> {
    const d = this.delegate()
    const name = await d.methods.name().call();
    const symbol = await d.methods.symbol().call();
    const dec = await d.methods.decimals().call();
    const decBn = bn(dec);

    const res = {
      address: d.options.address,
      name: name,
      symbol: symbol,
      decimals: decBn.toNumber()
    }
    console.debug(`Returning token values`, res);

    return res;
  }

  async approve(spender: Address, onTransactionHash: (hash: string) => void): Promise<boolean> {
    const amount = maxUint;

    console.debug(`Approving token amount`, amount, amount.toString());

    return this.delegate().methods.approve(spender, amount).send()
      .once('transactionHash', onTransactionHash)
      .then(res => {
        // TODO error handling
        console.debug('received success', res);
        return true;
      });
  }

  async allowance(owner: Address, spender: Address): Promise<BN> {
    const allowance =
      await this.delegate().methods.allowance(owner, spender).call()
        .then(bn);

    console.debug(`Spender ${spender}'s allowance of user ${owner}'s tokens is ${allowance.toString()}`,
                  this.delegate);
    return allowance;
  }

  async balanceOf(account: string): Promise<BN> {
    const balance =
      await this.delegate().methods.balanceOf(account).call()
        .then(bn);

    console.debug(`Balance of user ${account} is ${balance.toString()}`,
                  this.delegate);
    return balance;
  }
}

