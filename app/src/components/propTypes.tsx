import {Web3Connection} from "./connection/Web3Connection";
import {IERC20Service} from "./contract/IErc20Wrapper";
import {Vault, VaultService} from "./contract/VaultWrapper";
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

export interface HasVaultService {
  vaultService: VaultService;
}

export interface HasVaultValues {
  vault: Vault;
}

export interface HasToken {
  token: IERC20Service
}

export interface HasClassName {
  className?: string
}

