import React, { useState } from "react";

import styled from "styled-components";
import { AccountBalanceWallet } from '@material-ui/icons';

import { HasClassName } from "./propTypes";
import { useRecoilValue } from "recoil";
import { getAccountQuery, web3State } from "./web3State";

function Web3ConnectButton({ className }: {}
  & HasClassName) {
  const web3Connection = useRecoilValue(web3State);
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
    <button onClick={connect} disabled={disabled} className={className}>
      <AccountBalanceWallet />
      connect
    </button>
  );
}

function Web3WalletButton({ className }: {}
  & HasClassName) {
  const acc = useRecoilValue(getAccountQuery);

  return (
    <button className={className}>
      <AccountBalanceWallet />
      {acc}
    </button>
  );
}

const style = (buttonStyle: string, minTablet: number) => `
  grid-area: connect;
  align-self: center;
  ${buttonStyle}

  svg {
    vertical-align: -30%;
    padding-right: 6px;

    @media screen and (min-width: ${minTablet}px) {
      vertical-align: -25%;
      padding-right: 8px;
    }
  }
`;

export const ConnectButton = styled(Web3ConnectButton)`
  ${props => style(props.theme.buttonMixin, props.theme.minTablet)}
`;
export const WalletButton = styled(Web3WalletButton)`
  ${props => style(props.theme.buttonMixin, props.theme.minTablet)}
`;
