import React, {useEffect, useState} from "react";
import styled, {ThemeProvider} from "styled-components";
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {hot} from "react-hot-loader";
import {Reset} from "styled-reset";
import {
  defaultTheme,
  Stars,
  GlobalStyle
} from "./Theme";

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import {HasWeb3Connection} from "./propTypes";
import {local} from "./Config";
import {Web3Connection, web3Factory as w3f} from "./connection/Web3Connection";
import {VaultFactoryWrapper} from "./contract/VaultFactoryWrapper";

import {Header} from "./Header";
import {Create} from "./Create";
import {Vault} from "./Vault";
import {Announcements} from "./Announcement";

const web3Factory = w3f(local.connection, local.contracts);

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

const MainContainer = styled.div`
margin: ${props => props.theme.gutter * 4}px auto;
width: 90%;
max-width: ${props => props.theme.maxCard}px;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  width: 85%;
}
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

  return (
    <>
      <Header web3Connection={web3Connection} />
      <main>
        <MainContainer>
          <Announcements />
          <Switch>
            <Route path="/create">
              <Create web3Connection={web3Connection} />
            </Route>
            <Route path="/vault/:address"
              render={(props) =>
                <Vault address={props.match.params.address}
                  web3Connection={web3Connection} />} />
            <Route path="/">
              <AppContent />
            </Route>
          </Switch>
        </MainContainer>
      </main>
    </>
  );
}

export default hot(module)(App);
