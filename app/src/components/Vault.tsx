import React, {FormEvent, useEffect, useState} from "react";
import styled from "styled-components";

import {toast} from 'react-toastify';

import {HasVault, HasWeb3Connection, HasAddress, HasToken} from "./propTypes";
import {VaultWrapper} from "./contract/VaultWrapper";
import {IERC20Wrapper} from "./contract/IErc20Wrapper";


// TODO refactor to aggregated function
const ActiveSubs = ({vault}: {} & HasVault) => {
  const [activeSubs, setActiveSubs] = useState("0");

  useEffect(() => {
    if (!!vault) {
      vault.activeSubscriptions()
        .then(setActiveSubs);
    }
  }, [vault]);

  return (
    <div>active subs: {activeSubs}</div>
  );
};

const CurrentDeposit = ({address, vault}: {} & HasAddress & HasVault) => {
  const [deposit, setDeposit] = useState("0");

  useEffect(() => {
    if (!!vault && !!address) {
      vault.depositOf(address)
        .then(setDeposit);
    }

  }, [vault, address]);

  return (
    <div>current deposit: {deposit}</div>
  );
};

const DepositForm = ({vault, token, web3Connection}: {}
  & HasVault & HasToken & HasWeb3Connection) => {
  // TODO allowance needs to have a proper type
  const [allowance, setAllowance] = useState("");

  const getAllowance = () => {
    if (!!token && !!vault) {
      web3Connection.getAccount()
        .then(acc => {
          if (!!acc) {
            token.allowance(acc, vault.address)
              .then(setAllowance);
          }
        });
    }
  };

  useEffect(getAllowance);

  const doSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log(`current allowance:`, allowance);
    if (!!token && !!vault) {
      if (!!allowance && allowance !== "0") {
        // TODO deposit
        console.debug(`Depositing funds`);
        const amount = "1000"
        vault.deposit(amount, hash => toast.info(`tx hash: ${hash}`))
        .then(res => {
          toast.success(`Deposited ${amount} into vault`);
        });

      } else {
        // approve funds
        console.debug(`Approving funds`);
        token
          .approve(vault.address, (hash) => toast.info(`Approval tx: ${hash}`))
          .then(res => getAllowance());
      }
    }
  }

  return (
    <form onSubmit={doSubmit}>
      <input type="submit" value={!!allowance && allowance !== "0" ? "Deposit" : "Approve"} />
    </form>
  );
};

export const Vault = ({address, web3Connection}: {address: string} & HasWeb3Connection) => {
  // TODO check for existence of vault instance
  const [vault, setVault] = useState<VaultWrapper | null>(null);
  const [token, setToken] = useState<IERC20Wrapper | null>(null);
  const [account, setAccount] = useState<Address | null>(null);

  useEffect(() => {
    web3Connection.getVault(address)
      .then(setVault);
  }, [address, web3Connection]);

  useEffect(() => {
    if (!!vault) {
      vault.token()
        .then(tokenAddress => web3Connection.getToken(tokenAddress)
          .then(setToken));
    }
  }, [address, web3Connection, vault]);

  useEffect(() => {
    web3Connection.getAccount().then(setAccount);
  }, [web3Connection]);

  return (
    <div>
      <h1>Vault: {address}</h1>
      <ActiveSubs vault={vault} />
      <CurrentDeposit vault={vault} address={account} />
      <DepositForm vault={vault} web3Connection={web3Connection} token={token} />
    </div>
  );
};
