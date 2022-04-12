import {Web3Connection} from "./connection/Web3Connection";
import {ERC20Service, ERC20Token} from "./contract/Erc20Wrapper";
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

export interface HasTokenService {
  tokenService: ERC20Service
}

export interface HasToken {
  token: ERC20Token
}

export interface HasAllowance {
  allowance: BN;
}

export interface HasWalletBalance {
  walletBalance: BN;
}

export interface HasCurrentDeposit {
  currentDeposit: BN;
}

export interface HasClassName {
  className?: string
}

