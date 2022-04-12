import {Address} from "../helper/types";

export interface AppConfig {
  connection: ConnectionConfig;
  contracts: ContractAddresses;
}

export interface ConnectionConfig {
  chainId: number;
  rpcUrl: string;
}

export interface ContractAddresses {
  createz: Address;
  vaultFactory: Address;
}

export const local: AppConfig = {
  connection: {
    chainId: 1337,
    rpcUrl: "ws://localhost:9545"
  },
  contracts: {
    createz: "0x8a1D7e538D37B5aE7aC07FfcD668159cc5aaD12d",
    vaultFactory: "0xd97B877441d113E4f972b5310C8d264e1A75714B"
  }
}
