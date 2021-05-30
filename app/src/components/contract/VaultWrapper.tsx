import {
  CreatorVault
} from '../../../../types/web3-v1-contracts/CreatorVault';

import {Address} from "../types";

import BN from "bn.js";
import {bn, maxUint, zero} from "../util";

export interface Vault {
  readonly version: string;
  readonly address: Address;
  readonly token: Address;
  readonly activeSubs: BN;
}
/**
  * Provides abstraction on top of a CreatorVault
  */
export interface VaultWrapper extends VaultService {


  readonly address: Address;

  /**
    * version of this vault
    */
  version(): Promise<string>;

  /**
    * the token of this vault
    */
  token(): Promise<Address>;

  /**
    * gets the number of active subscriptions
    */
  activeSubscriptions(): Promise<BN>;
}

export interface VaultService {
  getValues(): Promise<Vault>

  /**
    * gets the current pending deposit of an address
    */
  depositOf(address: Address): Promise<BN>;

  /**
    * deposit amount into vault
    */
  deposit(amount: BN,
    onTransactionHash: (hash: string) => void): Promise<boolean>;
}

export class Web3Vault implements VaultWrapper {

  private delegate: CreatorVault;

  public readonly address: Address;

  constructor(delegate: CreatorVault) {
    this.delegate = delegate;
    this.address = delegate.options.address;
  }

  async getValues(): Promise<Vault> {
    const values = await this.delegate.methods.getValues().call();

    console.debug(`Vault ${this.address} values loaded`, values, this.delegate);
    return {
      ...values,
      address: values.addr,
      activeSubs: bn(values.activeSubscriptions)
    };
  }

  public async version(): Promise<string> {
    const version = await this.delegate.methods.version().call();

    console.debug(`Vault is version ${version}`, this.delegate);
    return version;
  }

  public async token(): Promise<Address> {
    const tokenAddress = await this.delegate.methods.token().call();

    console.debug(`Vault uses ${tokenAddress} token`, this.delegate);
    return tokenAddress;
  }

  public async activeSubscriptions(): Promise<BN> {
    const subs =
      await this.delegate.methods.activeSubscriptions().call()
        .then(bn);

    console.debug(`Vault has ${subs.toString()} subs`, this.delegate);
    return subs;
  }

  public async depositOf(address: Address): Promise<BN> {
    console.log(`despositOf `, address);
    const deposit =
      await this.delegate.methods.depositOf(address).call()
        .then(bn);

    console.debug(`Deposit of address ${address} in vault is ${deposit.toString()}`,
      this.delegate);
    return deposit;
  }

  public async deposit(amount: BN,
    onTransactionHash: (hash: string) => void): Promise<boolean> {
    return this.delegate.methods.deposit(amount).send()
      .once("transactionHash", onTransactionHash)
      .then(res => {
        console.debug(`Deposited ${amount.toString()} to contract`,
          this.delegate, res);
        return true;
      });

  }
}
