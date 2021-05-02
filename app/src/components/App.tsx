import * as React from "react";
import styled from "styled-components";
import {hot} from "react-hot-loader";
import {Reset} from "styled-reset";

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
  componentDidMount() {
    //    console.log(web3.currentProvider);
    //    const metamask = new Web3(web3.currentProvider);
    //const metamask = new Web3("ws://localhost:9545")
    //metamask.eth.getAccounts().then(console.log);

  }

  public render() {
    return (
      <React.Fragment>
        <Reset />
        <AppContainer />
      </React.Fragment>
    );
  }
}

export default hot(module)(App);
