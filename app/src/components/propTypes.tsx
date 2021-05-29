import {Web3Connection} from "./connection/Web3Connection";
import {IERC20Wrapper} from "./contract/IErc20Wrapper";
import {Vault, VaultWrapper} from "./contract/VaultWrapper";
import {Address} from "./types";

export interface HasWeb3Connection {
  web3Connection: Web3Connection
}

export interface HasAddress {
  address: Address;
}

export interface HasAccount {
  account: Address | null;
}

export interface HasVault {
  vault: VaultWrapper;
}

export interface HasVaultValues {
  vaultValues: Vault;
}

export interface HasToken {
  token: IERC20Wrapper
}

export interface HasClassName {
  className?: string
}

