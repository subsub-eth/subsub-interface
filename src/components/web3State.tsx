import { atom, RecoilState, selector, useRecoilState } from 'recoil'
import { local } from "./Config";
import { Web3Connection, web3Factory as w3f } from "./connection/Web3Connection";

export const web3Factory = w3f(local.connection, local.contracts);

// TODO is it cool init with null?
const initialConnection = web3Factory.getInstance(() => null);

export const web3State: RecoilState<Web3Connection> = atom({
  key: 'web3State',
  default: initialConnection,
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

