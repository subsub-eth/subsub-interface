import * as React from "react";
import { hot } from "react-hot-loader";

const reactLogo = require("./../assets/img/react_logo.svg");
//import "./../assets/scss/App.scss";

class App extends React.Component<Record<string, unknown>, any> {
  public render() {
    return (
      <div className="app">
        <h1>Hello World!</h1>
        <p>agagagag</p>
      </div>
    );
  }
}

export default hot(App);
