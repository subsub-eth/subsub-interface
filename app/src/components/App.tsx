import * as React from "react";
import styled from "styled-components";
import { hot } from "react-hot-loader";

import * as Buffer from "buffer";
import Web3 from 'web3';

const reactLogo = require("./../assets/img/react_logo.svg");

const red = "red";

const AppContainer = styled.div`
  font-family: helvetica, arial, sans-serif;
  padding: 2em;
  border: 5px solid ${red};
`;

const Paragraph = styled.p`
    background-color: yellow;
`;

export default class App extends React.Component<Record<string, unknown>, any> {
  componentDidMount() {
//    console.log(web3.currentProvider);
//    const metamask = new Web3(web3.currentProvider);
    //const metamask = new Web3("ws://localhost:9545")
    //metamask.eth.getAccounts().then(console.log);

  }

  public render() {
    return (
      <AppContainer>
        <h1>Hello World!</h1>
        <Paragraph>agagagag</Paragraph>
      </AppContainer>
    );
  }
}

//export default hot(App);
