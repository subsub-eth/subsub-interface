import {
  CreatorVault
} from '../../../../types/web3-v1-contracts/CreatorVault';

import {Address} from "../types";

/**
  * Provides abstraction on top of a CreatorVault
  */
export interface VaultWrapper {

  readonly address: Address;

  /**
    * the token of this vault
  */
  token(): Promise<Address>;

  /**
    * gets the number of active subscriptions
    */
  activeSubscriptions(): Promise<string>;

  /**
    * gets the current pending deposit of an address
    */
  depositOf(address: Address): Promise<string>;

  /**
    * deposit amount into vault
  */
  deposit(amount: string,
                       onTransactionHash: (hash: string) => void): Promise<boolean>;
}

export class Web3Vault implements VaultWrapper {

  private delegate: CreatorVault;

  address: Address;

  constructor(delegate: CreatorVault) {
    this.delegate = delegate;
    this.address = delegate.options.address;
  }

  public async token(): Promise<Address> {
    const tokenAddress = await this.delegate.methods.token().call();

    console.debug(`Vault uses ${tokenAddress} token`, this.delegate);
    return tokenAddress;
  }

  public async activeSubscriptions(): Promise<string> {
    const subs = await this.delegate.methods.activeSubscriptions().call();

    console.debug(`Vault has ${subs} subs`, this.delegate);
    return subs;
  }

  public async depositOf(address: Address): Promise<string> {
    const deposit = await this.delegate.methods.depositOf(address).call();

    console.debug(`Deposit of address ${address} in vault is ${deposit}`,
      this.delegate);
    return deposit;
  }

  public async deposit(amount: string,
                       onTransactionHash: (hash: string) => void): Promise<boolean> {
    return this.delegate.methods.deposit(amount).send()
    .once("transactionHash", onTransactionHash)
    .then(res => {
      console.debug(`Deposited ${amount} to contract`, this.delegate);
      return true;
    });

  }
}
