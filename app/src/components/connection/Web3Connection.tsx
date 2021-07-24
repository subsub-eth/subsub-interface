import {AppConfig, ConnectionConfig, ContractAddresses} from "../Config";
import Web3 from "web3";
import {VaultFactoryWrapper, Web3VaultFactory} from "../contract/VaultFactoryWrapper";
import {VaultWrapper, Web3Vault} from "../contract/VaultWrapper";
import {ERC20Wrapper, Web3ERC20} from "../contract/Erc20Wrapper";

import {CreatorVaultFactory} from "../../../../types/web3-v1-contracts/CreatorVaultFactory";
import {CreatorVault} from "../../../../types/web3-v1-contracts/CreatorVault";
import {ERC20} from "../../../../types/web3-v1-contracts/ERC20";

import CreatorVaultFactoryAbi from "../../../../build/contracts/CreatorVaultFactory.json";
import CreatorVaultAbi from "../../../../build/contracts/CreatorVault.json";
import ERC20VaultAbi from "../../../../build/contracts/ERC20.json";

import {Address} from "../types";

export function web3Factory(conn: ConnectionConfig,
  contracts: ContractAddresses): Web3Factory {
  return new DefaultWeb3Factory(conn, contracts);
}

type ProviderType = "injected" | "default";

/**
  * Creates a Web3 Connection and manages connection changes at runtime
  **/
export interface Web3Factory {
  /**
    * Returns a new instance that either uses a configured default or uses the
    * given provider
    *
    * @param ethereum given/injected provider
    * @returns a web3Connection
    **/
  getInstance(ethereum: () => any | null):
    Promise<Web3Connection>;

  /**
    * Creates a new instance that either uses a configured default or uses the
    * given provider
    *
    * @param changeCallback is called with an updated instance if a runtime
    * config change occurs
    * @param ethereum given/injected provider
    **/
  createInstanceOnChange(changeCallback: (connection: Web3Connection) => void,
    ethereum: any | null):
    Promise<void>;
}

/**
  * Creates a Web3 Connection and manages connection changes at runtime
  **/
class DefaultWeb3Factory implements Web3Factory {
  private connection: ConnectionConfig;
  private contracts: ContractAddresses;

  constructor(connection: ConnectionConfig,
    contracts: ContractAddresses) {
    this.connection = connection;
    this.contracts = contracts;
  }

  /**
    * Returns a new instance that either uses a configured default or uses the
    * given provider
    *
    * @param ethereum given/injected provider
    * @returns a web3Connection
    **/
  async getInstance(ethereum: () => any | null):
    Promise<Web3Connection> {

    const instance = await this.createInstance(ethereum);

    return instance;
  }

  /**
    * Creates a new instance that either uses a configured default or uses the
    * given provider
    *
    * @param changeCallback is called with an updated instance if a runtime
    * config change occurs
    * @param ethereum given/injected provider
    **/
  async createInstanceOnChange(changeCallback: (connection: Web3Connection) => void,
    ethereum: () => any | null):
    Promise<void> {

    if (ethereum()) {
      // register change callbacks on injected provider even if it is on wrong
      // network.
      console.log(`registering change callbacks`);
      this.registerChangeCallbacks(ethereum, changeCallback);
    }
  }

  private registerChangeCallbacks(ethereum: () => any, changeCallback:
    (connection: Web3Connection) => void) {
    const recreate = () => {
      // TODO error logging
      this.createInstance(ethereum).then(changeCallback);
    }
    const eth = ethereum();
    // TODO is there a way to trigger on metamask unlock?
    eth.on('connect', (connectionInfo: any) => {
      // TODO do we actually need this and a disconnect event?
      console.log(`Connected event`, connectionInfo);
    });

    eth.on('disconnect', (providerRpcError: any) => {
      // TODO do we actually need this and a disconnect event?
      console.log(`Disconnect event`, providerRpcError);
    });

    eth.on('chainChanged', (chainId: any) => {
      console.log(`Creating new web3 connection after chainId change`);
      recreate();
    });

    eth.on('accountsChanged', (accounts: any) => {
      console.log(`Creating new web3 connection after accounts change`);
      recreate();
    });
  }

  private async createInstance(ethereum: () => any): Promise<Web3Connection> {
    const eth = ethereum();
    const provider = await this.getProvider(eth);

    console.log(`creating new web3 connection`);
    return provider === "default" ?
      new DefaultWeb3Connection(() => new Web3(this.connection.rpcUrl), this.contracts) :
      new InjectedWeb3Connection(() => new Web3(ethereum()), this.contracts)
  }

  private async getProvider(ethereum: any): Promise<ProviderType> {
    const checkChainId = async (id: number) => {
      const res = await ethereum.request({method: "eth_chainId"});
      console.log(`Current chainId is ${res}`);
      return res == id;
    };

    if (ethereum && ethereum.request) {

      if (await checkChainId(this.connection.chainId)) {
        // provider is injected and chain id matches
        console.log(`Using injected web3 provider`);
        return "injected";
      }

    }

    console.log(`No matching injected provider found, using default connection`);

    return "default";
  }
}


export interface Web3Connection {

  isConnectable(): boolean

  connect(): Promise<string>

  isConnected(): Promise<boolean>

  getAccount(): Promise<string | null>

  // get contract X
  // list vault contract
  getToken(address: Address): Promise<ERC20Wrapper>

  getVaultFactory(): Promise<VaultFactoryWrapper>

  getVault(address: Address): Promise<VaultWrapper>
}

function getContract<T>(web3: () => Web3, abi: any,
  address: Address, account?: Address | null) {
  const opt = !!account ? {from: account} : {};
  const web3Contract = () =>
    (new (web3()).eth.Contract(abi,
      address,
      opt) as any) as T;

  return web3Contract;
}

class InjectedWeb3Connection implements Web3Connection {
  private readonly web3: () => Web3;
  private readonly contracts: ContractAddresses;

  constructor(web3: () => Web3, contracts: ContractAddresses) {
    this.web3 = web3;
    this.contracts = contracts;
  }

  isConnectable(): boolean {
    return false;
  }

  async connect(): Promise<string> {
    const accounts = await this.web3().eth.requestAccounts();
    const a = accounts[0];
    if (a === undefined) {
      throw new Error('Connect did not return account');
    }
    return a;
  }

  async isConnected(): Promise<boolean> {
    const acc = await this.getAccount();
    return !!acc;
  }

  async getAccount(): Promise<Address | null> {
    const accounts = await this.web3().eth.getAccounts();
    console.log(`returning accounts: ${accounts}`);
    return accounts[0] === undefined ? null : accounts[0];
  }

  async getVaultFactory(): Promise<VaultFactoryWrapper> {
    const account = await this.getAccount();
    const web3Contract =
      getContract<CreatorVaultFactory>(this.web3,
        CreatorVaultFactoryAbi.abi,
        this.contracts.vaultFactory,
        account);
    console.log(`returning web3Contract`, web3Contract);
    return new Web3VaultFactory(web3Contract);
  }

  async getVault(address: string): Promise<VaultWrapper> {
    const account = await this.getAccount();
    const web3Contract =
      getContract<CreatorVault>(this.web3,
        CreatorVaultAbi.abi,
        address,
        account);
    console.log(`returning web3Contract`, web3Contract);
    return new Web3Vault(web3Contract);
  }

  async getToken(address: string): Promise<ERC20Wrapper> {
    const account = await this.getAccount();
    const web3Contract =
      getContract<ERC20>(this.web3,
        ERC20VaultAbi.abi,
        address,
        account);
    console.log(`returning web3Contract`, web3Contract);
    return new Web3ERC20(web3Contract);
  }
}

class DefaultWeb3Connection implements Web3Connection {
  private web3: () => Web3;
  private readonly contracts: ContractAddresses;

  constructor(web3: () => Web3, contracts: ContractAddresses) {
    this.web3 = web3;
    this.contracts = contracts;
  }

  isConnectable(): boolean {
    return true;
  }

  async connect(): Promise<string> {
    return Promise.reject("Unable to connect on default connection");
  }
  async isConnected(): Promise<boolean> {
    return false;
  }
  async getAccount(): Promise<string | null> {
    return null;
  }

  async getVaultFactory(): Promise<VaultFactoryWrapper> {
    const web3Contract =
      getContract<CreatorVaultFactory>(this.web3,
        CreatorVaultFactoryAbi.abi,
        this.contracts.vaultFactory);
    console.log(`returning web3Contract ${web3Contract}`);
    return new Web3VaultFactory(web3Contract);
  }

  async getVault(address: string): Promise<VaultWrapper> {
    const web3Contract =
      getContract<CreatorVault>(this.web3,
        CreatorVaultAbi.abi,
        address);
    console.log(`returning web3Contract`, web3Contract);
    return new Web3Vault(web3Contract);
  }

  async getToken(address: string): Promise<ERC20Wrapper> {
    const web3Contract =
      getContract<ERC20>(this.web3,
        ERC20VaultAbi.abi,
        address);
    console.log(`returning web3Contract`, web3Contract);
    return new Web3ERC20(web3Contract)
  }
}
