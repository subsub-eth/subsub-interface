import React, { Suspense, useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import { hot } from "react-hot-loader";
import { Reset } from "styled-reset";
import {
  defaultTheme,
  Stars,
  GlobalStyle
} from "./Theme";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { HasWeb3Connection } from "./propTypes";
import { web3Factory, web3State } from "./web3State";
import { VaultFactoryWrapper } from "./contract/VaultFactoryWrapper";

import { Header } from "./Header";
import { Create } from "./Create";
import { Vault } from "./vault/Vault";
import { Announcements } from "./Announcement";
import { vaultAddressState } from "./vault/vaultState";

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
  return (
    <Router>
      <RecoilRoot>
        <ThemeProvider theme={defaultTheme}>
          <Reset />
          <GlobalStyle />
          <Suspense fallback={<></>}>
            <AppContainer />
          </Suspense>
          <Stars />
          <ToastContainer />
        </ThemeProvider>
      </RecoilRoot>
    </Router>
  );
}

function AppContainer() {
  const [changeCallbackRegistered, setChangeCallBackRegistered] = useState(false);
  const web3Connection = useRecoilValue(web3State)

  // register change handling
  const [, setWeb3Connection] = useRecoilState(web3State);
  if (!changeCallbackRegistered) {
    web3Factory.createInstanceOnChange(setWeb3Connection, () => window.ethereum);
    setChangeCallBackRegistered(true);
  }

  return (
    <>
      <Header />
      <main>
        <MainContainer>
          <Announcements />
          <Switch>
            <Route path="/create">
              <Create />
            </Route>
            <Route path="/vault/:address"
              render={(props) =>
                <RecoilRoot initializeState={({ set }) =>
                  set(vaultAddressState, props.match.params.address)}>
                  <Vault />
                </RecoilRoot>
              } />
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
