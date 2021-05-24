import {Web3Connection} from "./connection/Web3Connection";
import {IERC20Wrapper} from "./contract/IErc20Wrapper";
import {VaultWrapper} from "./contract/VaultWrapper";
import {Address} from "./types";

export interface HasWeb3Connection {
  web3Connection: Web3Connection
}

export interface HasAddress {
  address: Address | null
}

export interface HasVault {
  vault: VaultWrapper | null
}

export interface HasToken {
  token: IERC20Wrapper | null
}

export interface HasClassName {
  className?: string
}

