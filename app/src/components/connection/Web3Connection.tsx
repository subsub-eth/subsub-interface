import {AppConfig, ConnectionConfig, ContractAddresses} from "../Config";
import Web3 from "web3";
import {VaultFactoryWrapper, Web3VaultFactory} from "../contract/VaultFactoryWrapper";
import {CreatorVaultFactory} from "../../../../types/web3-v1-contracts/CreatorVaultFactory";
import CreatorVaultFactoryAbi from "../../../../build/contracts/CreatorVaultFactory.json";
import {Address} from "../types";

export function web3Factory(conn: ConnectionConfig,
  contracts: ContractAddresses): Web3Factory {
  return new DefaultWeb3Factory(conn, contracts);
}

/**
  * Creates a Web3 Connection and manages connection changes at runtime
  **/
export interface Web3Factory {
  /**
    * Returns a new instance that either uses a configured default or uses the
    * given provider
    *
    * @param changeCallback is called with an updated instance if a runtime
    * config change occurs
    * @param ethereum given/injected provider
    * @returns a web3Connection
    **/
  getInstance(changeCallback: (connection: Web3Connection) => void,
    ethereum: any | null):
    Promise<Web3Connection>;
}

/**
  * Creates a Web3 Connection and manages connection changes at runtime
  **/
class DefaultWeb3Factory implements Web3Factory {
  private connection: ConnectionConfig;
  private contracts: ContractAddresses;

  // only viable for metamask?
  private callbacksRegistered: boolean = false;

  constructor(connection: ConnectionConfig,
    contracts: ContractAddresses) {
    this.connection = connection;
    this.contracts = contracts;
  }

  /**
    * Returns a new instance that either uses a configured default or uses the
    * given provider
    *
    * @param changeCallback is called with an updated instance if a runtime
    * config change occurs
    * @param ethereum given/injected provider
    * @returns a web3Connection
    **/
  async getInstance(changeCallback: (connection: Web3Connection) => void,
    ethereum: any | null):
    Promise<Web3Connection> {

    const instance = await this.createInstance(ethereum);
    if (ethereum && !this.callbacksRegistered) {
      // register change callbacks on injected provider even if it is on wrong
      // network.
      console.log(`registering change callbacks`);
      this.registerChangeCallbacks(ethereum, changeCallback);
    }

    return instance;
  }

  private registerChangeCallbacks(ethereum: any, changeCallback:
    (connection: Web3Connection) => void) {
    const recreate = () => {
      this.createInstance(ethereum).then(changeCallback);
    }
    ethereum.on('chainChanged', (chainId: any) => {
      console.log(`Creating new web3 connection after chainId change`);
      recreate();
    });

    ethereum.on('accountsChanged', (accounts: any) => {
      console.log(`Creating new web3 connection after accounts change`);
      recreate();
    });
  }

  private async createInstance(ethereum: any): Promise<Web3Connection> {
    const [web3, defaultConnection] = await this.getProvider(ethereum);

    console.log(`creating new web3 connection`);
    return defaultConnection ?
        new DefaultWeb3Connection(web3, this.contracts) :
        new InjectedWeb3Connection(web3, this.contracts)
  }

  private async getProvider(ethereum: any): Promise<[Web3, boolean]> {
    const checkChainId = async (id: number) => {
      const res = await ethereum.request({method: "eth_chainId"});
      console.log(`Current chainId is ${res}`);
      return res == id;
    };

    if (ethereum && ethereum.request) {

      if (await checkChainId(this.connection.chainId)) {
        // provider is injected and chain id matches
        console.log(`Using injected web3 provider`);
        return [new Web3(ethereum), false];
      }

    }

    console.log(`No matching injected provider found, using default connection`);

    return [new Web3(this.connection.rpcUrl), true];
  }
}


export interface Web3Connection {

  isConnectable(): boolean

  connect(): Promise<string>

  isConnected(): Promise<boolean>

  getAccount(): Promise<string | null>

  // get contract X
  // list vault contract
  getVaultFactory(): Promise<VaultFactoryWrapper>
}

function getContract<T>(web3: Web3, abi: any,
  address: Address, account?: Address | null) {
  const opt = !!account ? {from: account} : {};
  const web3Contract =
    (new web3.eth.Contract(abi,
      address,
      opt) as any) as T;

  return web3Contract;
}

class InjectedWeb3Connection implements Web3Connection {
  private readonly web3: Web3;
  private readonly contracts: ContractAddresses;

  constructor(web3: Web3, contracts: ContractAddresses) {
    this.web3 = web3;
    this.contracts = contracts;
  }

  isConnectable(): boolean {
    return false;
  }

  async connect(): Promise<string> {
    const accounts = await this.web3.eth.requestAccounts();
    return accounts[0];
  }

  async isConnected(): Promise<boolean> {
    const acc = await this.getAccount();
    return !!acc;
  }

  async getAccount(): Promise<Address | null> {
    const accounts = await this.web3.eth.getAccounts();
    console.log(`returning accounts: ${accounts}`);
    return accounts[0];
  }

  async getVaultFactory(): Promise<VaultFactoryWrapper> {
    const account = await this.getAccount();
    const web3Contract =
      getContract<CreatorVaultFactory>(this.web3,
        CreatorVaultFactoryAbi.abi,
        this.contracts.vaultFactory,
        account);
    console.log(`returning web3Contract ${web3Contract}`);
    return new Web3VaultFactory(web3Contract);
  }
}

class DefaultWeb3Connection implements Web3Connection {
  private web3: Web3;
  private readonly contracts: ContractAddresses;

  constructor(web3: Web3, contracts: ContractAddresses) {
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
}
