import * as React from "react";
import { hot } from "react-hot-loader";

import * as Buffer from "buffer";
import Web3 from 'web3';

const reactLogo = require("./../assets/img/react_logo.svg");
//import "./../assets/scss/App.scss";

export default class App extends React.Component<Record<string, unknown>, any> {
  componentDidMount() {
//    console.log(web3.currentProvider);
//    const metamask = new Web3(web3.currentProvider);
    //const metamask = new Web3("ws://localhost:9545")
    //metamask.eth.getAccounts().then(console.log);

  }

  public render() {
    return (
      <div className="app">
        <h1>Hello World!</h1>
        <p>agagagag</p>
      </div>
    );
  }
}

//export default hot(App);
