import { atomFamily, selectorFamily, useSetRecoilState } from "recoil";
import { ERC20Service, ERC20Token } from "./contract/Erc20Wrapper";
import { Address } from "./types";
import { zero } from "./util";
import { getAccountQuery, web3State } from "./web3State";


export const tokenServiceState = selectorFamily<ERC20Service, string>({
  key: 'erc20Token',
  get: address => async ({ get }) => {
    const web3Connection = get(web3State);
    const token = await web3Connection.getToken(address);
    console.debug(`Loaded token service for token address`, address, token);
    return token;
  }
});

const tokenBalanceRequestId = atomFamily({
  key: 'erc20TokenBalanceRequestId',
  default: 0
})

const tokenAllowanceRequestId = atomFamily({
  key: 'erc20TokenAllowanceRequestId',
  default: 0
})

export const tokenValuesState = selectorFamily<ERC20Token, string>({
  key: 'erc20TokenValues',
  get: address => async ({ get }) => {
    const tokenService = get(tokenServiceState(address));
    const values = await tokenService.getValues();
    console.debug(`Loaded token values from service at address`,
      values, tokenService, address);
    return values;
  }
})

export const tokenBalanceState = selectorFamily<BN, Address>({
  key: 'erc20TokenBalance',
  get: address => async ({ get }) => {
    const web3Connection = get(web3State);
    const account = get(getAccountQuery);
    if (account === null) {
      console.debug(`Not connected to wallet, returning 0 balance`,
        web3Connection);
      return zero;
    }
    // declare request id dep
    get(tokenBalanceRequestId(address));
    const tokenService = get(tokenServiceState(address));
    const balance = await tokenService.balanceOf(account);

    console.debug(`Balance of account ${account}: ${balance.toString}`,
      tokenService);

    return balance;
  }
})

export const useRefreshTokenBalance = (address: Address) => {
  const setTokenBalanceRequestId = useSetRecoilState(
    tokenBalanceRequestId(address));

  return () => {
    console.debug(`Updating token balance request id for refresh`, address);
    setTokenBalanceRequestId(id => id + 1);
  }
}

export const tokenAllowanceState = selectorFamily<BN, {
  address: Address,
  spender: Address
}>({
  key: 'erc20TokenAllowance',
  get: ({ address, spender }) => async ({ get }) => {
    const web3Connection = get(web3State);
    const owner = await web3Connection.getAccount();
    if (owner === null) {
      console.debug(`Not connected to wallet, returning 0 allowance`,
        web3Connection);
      return zero;
    }
    // declare request id dep
    get(tokenAllowanceRequestId(address));
    const tokenService = get(tokenServiceState(address));
    const allowance = await tokenService.allowance(owner, spender);

    console.debug(
      `Allowance on contract ${spender} by owner ${owner}: ${allowance.toString}`,
      tokenService);

    return allowance;
  }
})

export const useRefreshTokenAllowance = (address: Address) => {
  const setTokenAllowanceRequestId = useSetRecoilState(
    tokenAllowanceRequestId(address));

  return () => {
    console.debug(`Updating token allowance request id for refresh`, address);
    setTokenAllowanceRequestId(id => id + 1);
  }
}
