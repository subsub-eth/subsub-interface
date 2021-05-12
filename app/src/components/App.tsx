import React, {useEffect, useState} from "react";
import styled, {ThemeProvider} from "styled-components";
import {
  HashRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import {hot} from "react-hot-loader";
import {Reset} from "styled-reset";
import {
  defaultTheme,
  Stars,
  GlobalStyle
} from "./Theme";

import * as Buffer from "buffer";
import BN from "bn.js";
import Web3 from 'web3';

import CreatezAbi from "../../../build/contracts/Createz.json";
import {Createz} from "../../../types/web3-v1-contracts/Createz";

const reactLogo = require("./../assets/img/react_logo.svg");

const red = "red";


export const AppDiv = styled.div`
  font-family: helvetica, arial, sans-serif;
  padding: 2em;
  border: 5px solid ${red};
`;

export const Paragraph = styled.p`
    background-color: yellow;
    font-size: 24px;
    line-height: 1.5;
    padding: 1rem 0;
`;


export function AppContainer() {
  return (
    <AppDiv>
      <h1>Hello World!</h1>
      <Paragraph>agagagag</Paragraph>
    </AppDiv>
  );
}

async function getWeb3(): Promise<Web3> {
    console.log(`givenProvider: ${JSON.stringify(Web3.givenProvider)}`);
    if (window.ethereum) {
      console.log(`has injected: ${JSON.stringify(window.ethereum)}`);
      if (window.ethereum.isConnected()) {
        console.log(`is connected`);
      }
    }
    const acc = await getAccount();
    const web3 = new Web3(window.ethereum);

    return web3;
}

async function getAccount() {
  const res = await window.ethereum.request({method: 'eth_accounts'});
  if (!res) {
    return "";
  }
  const account = res[0];
  console.log(`connected account: ${account}`);
  return account;
}

async function requestAccounts() {
  const res = await window.ethereum.request({method: 'eth_requestAccounts'});
  console.log(`result: ${JSON.stringify(res)}`);
  const account = res[0];
  console.log(`requested account: ${account}`);
  return account;
}

async function createzContract(web3: Web3) {

  const acc = await getAccount();
  console.log(`setting default account on contract instance: ${acc}`);
  const contract = (new web3.eth.Contract(CreatezAbi.abi, "0x8a1D7e538D37B5aE7aC07FfcD668159cc5aaD12d", {from: acc}) as any) as Createz;
  contract.defaultAccount = web3.defaultAccount;
  return contract;
}

async function transfer1() {
  const acc = "0xe6c9a85134dea897cfd7dc7bbd8624cbd585173f";
  const web3 = await getWeb3();
  const createz = await createzContract(web3);
  const receipt = await createz.methods.transfer("0x11e1d4f72447169a54084bd147fbd161b3f9ec1d", Web3.utils.toWei(new BN(1))).send();
  console.log(`events: ${JSON.stringify(receipt.events)}`);
}

export function App() {

  const fromWei = Web3.utils.fromWei;
  const toWei = Web3.utils.toWei;
  const [acc, setAcc] = useState("0");

  useEffect(() => {
    const func = async () => {
      const web3 = await getWeb3();
      const account = (await getAccount()) + "";

      const createz = await createzContract(web3);
      if (account) {
        const balance = await createz.methods.balanceOf(account).call();
        console.log(`balance: ${fromWei(balance)}`);
        setAcc(account);
      }

    };
    func();
  });

  return (
    <Router>
      <ThemeProvider theme={defaultTheme}>
        <Reset />
        <GlobalStyle />
        <header>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/create">Create</NavLink>
          <p>Account: {acc}</p>
          <button onClick={() => requestAccounts()}>connect</button>
          <button onClick={() => transfer1()}>transfer 1</button>
        </header>
        <Switch>
          <Route path="/create">
            <div>create</div>
          </Route>
          <Route path="/">
            <AppContainer />
          </Route>
        </Switch>
        <Stars />
      </ThemeProvider>
    </Router>
  );
}

export default hot(module)(App);
