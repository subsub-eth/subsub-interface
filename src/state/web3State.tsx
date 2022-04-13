import { atom, AtomEffect, RecoilState, selector, useRecoilState } from 'recoil'
import { local } from "../config/Config";
import { Web3Connection, web3Factory as w3f } from "../service/connection/Web3Connection";

export const web3Factory = w3f(local.connection, local.contracts);

const eth = () => window.ethereum;

const initialConnection = web3Factory.getInstance(eth);
const web3ConnectionChangeEffect: AtomEffect<Web3Connection> =
  ({ setSelf, trigger }) => {
    console.debug("Initializing web3 connection atom")
    if (trigger === 'get') {
      console.debug("Setting initial web3 connection instance");
      setSelf(initialConnection);
    }

    console.debug("Registering change callback on connection")
    web3Factory.createInstanceOnChange(setSelf, eth);
  }

export const web3State: RecoilState<Web3Connection> = atom({
  key: 'web3State',
  default: initialConnection,
  effects: [
    web3ConnectionChangeEffect
  ]
})

export const isConnectedQuery = selector({
  key: "isConnectedToWallet",
  get: async ({ get }) => {
    const w3 = get(web3State);
    const connected = await w3.isConnected();
    console.debug(`connected to wallet account`, connected);
    return connected;
  }
})

export const getAccountQuery = selector({
  key: "getAccountFromWallet",
  get: async ({ get }) => {
    const w3 = get(web3State);
    const acc = await w3.getAccount();
    console.debug(`connect to account`, acc);
    return acc;
  }
})

