import Web3 from "web3";
import {VaultFactoryWrapper, Web3VaultFactory} from "../contract/VaultFactoryWrapper";
import {CreatorVaultFactory} from "../../../../types/web3-v1-contracts/CreatorVaultFactory";
import CreatorVaultFactoryAbi from "../../../../build/contracts/CreatorVaultFactory.json";

/**
  * Creates a Web3 Connection and manages connection changes at runtime
  **/
export class Web3Factory {
  private static instance: Web3Connection;

  private static callbacksRegistered: boolean = false;

  /**
    * Returns a new instance that either uses a configured default or uses the 
    * given provider 
    *
    * @param changeCallback is called with an updated instance if a runtime 
    * config change occurs
    * @param ethereum given/injected provider
    * @returns a web3Connection
    **/
  static async getInstance(changeCallback: (connection: Web3Connection) => void,
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

  private static registerChangeCallbacks(ethereum: any, changeCallback:
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

  private static async createInstance(ethereum: any): Promise<Web3Connection> {
    const [web3, defaultConnection] = await this.getProvider(ethereum);

    console.log(`creating new web3 connection`);
    this.instance = new DefaultWeb3Connection(web3, defaultConnection);

    return this.instance;
  }

  private static async getProvider(ethereum: any): Promise<[Web3, boolean]> {
    const checkChainId = async (id: number) => {
      const res = await ethereum.request({method: "eth_chainId"});
      console.log(`Current chainId is ${res}`);
      return res == id;
    };

    if (ethereum && ethereum.request) {

      // TODO get chainid from config
      if (await checkChainId(1337)) {
        // provider is injected and chain id matches
        console.log(`Using injected web3 provider`);
        return [new Web3(ethereum), false];
      }

    }

    console.log(`No matching injected provider found, using default connection`);

    // TODO get from config
    return [new Web3("ws://localhost:9545"), true];
  }
}


export interface Web3Connection {

  isUsingDefaultConnection(): boolean

  // TODO isConnectable();
  connect(): Promise<string>

  isConnected(): Promise<boolean>

  getAccount(): Promise<string | null>

  // get contract X
  // list vault contract
  getVaultFactory(): Promise<VaultFactoryWrapper>
}

// TODO impl for default connection seperated from injected one
export class DefaultWeb3Connection implements Web3Connection {
  private web3: Web3;
  private isDefaultConnection: boolean;

  constructor(web3: Web3, isUsingDefaultConnection: boolean) {
    this.web3 = web3;
    this.isDefaultConnection = isUsingDefaultConnection;
  }

  isUsingDefaultConnection(): boolean {
    return this.isDefaultConnection;
  }

  async connect(): Promise<string> {
    if (this.isDefaultConnection) {
      return Promise.reject("Unable to connect on default connection");
    }
    const accounts = await this.web3.eth.requestAccounts();
    return accounts[0];
  }
  async isConnected(): Promise<boolean> {
    if (this.isDefaultConnection) {
      return false;
    }
    const acc = await this.getAccount();
    return !!acc;
  }
  async getAccount(): Promise<string | null> {
    if (this.isDefaultConnection) {
      return null;
    }
    const accounts = await this.web3.eth.getAccounts();
    console.log(`returning accounts: ${accounts}`);
    return accounts[0];
  }

  async getVaultFactory(): Promise<VaultFactoryWrapper> {
    const account = await this.getAccount();
    const web3Contract =
      (new this.web3.eth.Contract(CreatorVaultFactoryAbi.abi,
        "0xd97B877441d113E4f972b5310C8d264e1A75714B",
        {from: account}) as any) as CreatorVaultFactory;
    console.log(`returning web3Contract ${web3Contract}`);
    return new Web3VaultFactory(web3Contract);
  }
}
