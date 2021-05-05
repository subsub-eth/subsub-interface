import * as React from "react";
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
import Web3 from 'web3';

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

export class AppContainer extends React.Component<Record<string, unknown>, any> {

  public render() {
    return (
      <AppDiv>
        <h1>Hello World!</h1>
        <Paragraph>agagagag</Paragraph>
      </AppDiv>
    );
  }
}

class App extends React.Component<Record<string, unknown>, any> {

  public render() {
    return (
      <Router>
        <ThemeProvider theme={defaultTheme}>
          <Reset />
          <GlobalStyle />
          <header>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/create">Create</NavLink>
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
}

export default hot(module)(App);
