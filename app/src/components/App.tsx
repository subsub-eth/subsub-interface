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

import BN from "bn.js";
import Web3 from 'web3';

import {HasWeb3Connection} from "./propTypes";

import CreatezAbi from "../../../build/contracts/Createz.json";
import {Createz} from "../../../types/web3-v1-contracts/Createz";
import {Web3Connection, Web3Factory} from "./connection/Web3Connection";
import {VaultFactoryWrapper} from "./contract/VaultFactoryWrapper";

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


export function AppContent() {
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
  const web3 = new Web3(window.ethereum || "ws://localhost:9545");
  const b = await web3.eth.getBalance("0xe6c9A85134DeA897CFd7DC7bBd8624CbD585173f");
  console.log(`balance: ${b}`);
  console.log(`current provider: ${web3.currentProvider}`);
  //const acc = await getAccount();

  return web3;
}



async function createzContract(web3: Web3, web3Connection: Web3Connection) {

  const acc = await web3Connection.getAccount();
  console.log(`setting default account on contract instance: ${acc}`);
  const contract = (new web3.eth.Contract(CreatezAbi.abi, "0x8a1D7e538D37B5aE7aC07FfcD668159cc5aaD12d", {from: acc}) as any) as Createz;
  return contract;
}

async function transfer1(web3Connection: Web3Connection) {
  const acc = await web3Connection.getAccount();
  console.log(`Transferring from account ${acc}`);
  const web3 = await getWeb3();
  const createz = await createzContract(web3, web3Connection);
  const receipt = await createz.methods.transfer("0x11e1d4f72447169a54084bd147fbd161b3f9ec1d", Web3.utils.toWei(new BN(1))).send();
  console.log(`events: ${JSON.stringify(receipt.events)}`);
}

/**
  * App Main
  *
  * Provides basic setup with Router, Theme, global styling and web3 connection
  *
  **/
export function App() {
  const [web3Connection, setWeb3Connection] = useState<Web3Connection | null>(null);

  useEffect(() => {
    if (!web3Connection) {
      console.log(`creating new web3 connection, exisiting: ${web3Connection}`);
      Web3Factory.getInstance(setWeb3Connection, window.ethereum)
        .then(setWeb3Connection);
    }
  }, [web3Connection]);

  return (
    <Router>
      <ThemeProvider theme={defaultTheme}>
        <Reset />
        <GlobalStyle />
        {web3Connection ? <AppContainer web3Connection={web3Connection} /> : ""}
        <Stars />
      </ThemeProvider>
    </Router>
  );
}

function ConnectButton({web3Connection}: {} & HasWeb3Connection) {
  const [disabled, setDisabled] = useState(false);

  const connect = () => {
    console.log(`Trying to connect wallet`);
    setDisabled(true);
    return web3Connection.connect()
      .then(acc => {
        console.log(`connected to ${acc}`);
        setDisabled(false);
      })
      .catch(err => {
        console.log(`error ${err} occured`);
        setDisabled(false);
      })
  }

  return (
    <button onClick={connect} disabled={disabled}>connect</button>
  );
}

function WalletButton({web3Connection}: {} & HasWeb3Connection) {
  const [acc, setAccount] = useState<string | null>(null);

  useEffect(() => {
    web3Connection.getAccount()
      .then(s => setAccount(s));
  });

  return (
    <button >{acc}</button>
  );
}


function AppContainer({web3Connection}: {} & HasWeb3Connection) {
  const [connected, setConnected] = useState(false);
  const [factory, setFactory] = useState<VaultFactoryWrapper | null>(null);

  useEffect(() => {
    web3Connection.isConnected()
    .then(b => {
      console.log(`connected to wallet account: ${b}`);
      return setConnected(b);
    })
  }, [web3Connection]);

  useEffect(() => {
    web3Connection.getVaultFactory()
    .then(fac => {
      console.log(`setting factory ${fac}`);
      setFactory(fac);
    })

  }, [web3Connection, connected]);

  const createVault = () => {
    if (factory) {
      web3Connection.getAccount()
      .then(acc => factory.create("" + acc, hash => console.log(`hash: ${hash}`)));
    }
  }

  return (
    <>
      <header>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/create">Create</NavLink>
        {connected
          ? <WalletButton web3Connection={web3Connection}/>
          : <ConnectButton web3Connection={web3Connection} />}
        <button onClick={() => transfer1(web3Connection)}>transfer 1</button>
      </header>
      <Switch>
        <Route path="/create">
          <div>create</div>
          <button onClick={createVault}>do create</button>
        </Route>
        <Route path="/">
          <AppContent />
        </Route>
      </Switch>
    </>
  );
}

export default hot(module)(App);
