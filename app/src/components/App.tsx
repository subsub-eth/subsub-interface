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

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BN from "bn.js";
import Web3 from 'web3';

import {HasWeb3Connection} from "./propTypes";
import { AppConfig, local } from "./Config";
import {Web3Connection, Web3Factory, web3Factory as w3f} from "./connection/Web3Connection";
import {VaultFactoryWrapper} from "./contract/VaultFactoryWrapper";

import { Header } from "./Header";

const reactLogo = require("./../assets/img/react_logo.svg");

const red = "red";

const web3Factory = w3f(local.connection, local.contracts);


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
      web3Factory.getInstance(setWeb3Connection, window.ethereum)
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
        <ToastContainer />
      </ThemeProvider>
    </Router>
  );
}

function AppContainer({web3Connection}: {} & HasWeb3Connection) {
  const [factory, setFactory] = useState<VaultFactoryWrapper | null>(null);

  useEffect(() => {
    web3Connection.getVaultFactory()
    .then(fac => {
      console.log(`setting factory ${fac}`);
      setFactory(fac);
    })

  }, [web3Connection]);

  const createVault = () => {
    if (factory) {
      web3Connection.getAccount()
      .then(acc => factory.create("" + acc, hash => toast.info(`hash: ${hash}`)))
      .then(res => toast.success(`success! ${res}`), err => toast.error(`Error! ${err}`));
    }
  }

  return (
    <>
      <Header web3Connection={web3Connection}/>
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
