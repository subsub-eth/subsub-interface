import React, {FormEvent, useEffect, useState} from "react";
import styled from "styled-components";

import {toast} from 'react-toastify';

import BN from "bn.js";
import {bn, zero} from "./util";

import {HasVault, HasWeb3Connection, HasAddress, HasToken} from "./propTypes";
import {VaultWrapper} from "./contract/VaultWrapper";
import {IERC20Wrapper} from "./contract/IErc20Wrapper";
import {Address} from "./types";


// TODO refactor to aggregated function
const ActiveSubs = ({vault}: {} & HasVault) => {
  const [activeSubs, setActiveSubs] = useState(zero);

  useEffect(() => {
    if (!!vault) {
      vault.activeSubscriptions()
        .then(setActiveSubs);
    }
  }, [vault]);

  return (
    <div>active subs: {activeSubs.toString()}</div>
  );
};

const CurrentDeposit = ({address, vault}: {} & HasAddress & HasVault) => {
  const [deposit, setDeposit] = useState(zero);

  useEffect(() => {
    vault.depositOf(address)
      .then(setDeposit);
  }, [vault, address]);

  return (
    <div>current deposit: {deposit.toString()}</div>
  );
};

const DepositForm = ({vault, token, web3Connection}: {}
  & HasVault & HasToken & HasWeb3Connection ) => {
  // TODO allowance needs to have a proper type
  const [allowance, setAllowance] = useState<BN>(zero);
  const [account, setAccount] = useState<Address | null>(null);

  const getAllowance = () => {
    web3Connection.getAccount()
      .then(acc => {
        if (!!acc) {
          token.allowance(acc, vault.address)
            .then(setAllowance);
        }
      });
  };

  useEffect(getAllowance, [vault, web3Connection]);

  useEffect(() => {
    web3Connection.getAccount()
      .then(setAccount);
  }, [vault, web3Connection]);

  const doSubmit = (event: FormEvent) => {
    // do not actually send the form with a page load
    event.preventDefault();

    console.log(`current allowance:`, allowance);
    if (!allowance.isZero()) {
      // TODO deposit
      const amount = bn(1000);
      console.debug(`Depositing funds of ${amount.toString()} into vault`,
        vault);
      vault.deposit(amount, hash => toast.info(`tx hash: ${hash}`))
        .then(res => {
          console.debug(`Deposited ${amount.toString()} into vault`,
            vault, res);
          toast.success(`Deposited ${amount.toString()} into vault`);

        });

    } else {
      // approve funds
      console.debug(`Approving funds to vault`, vault);
      token
        .approve(vault.address, (hash) => toast.info(`Approval tx: ${hash}`))
        .then(res => {
          console.debug(`Successfully updated allowance`, res);
          // reload allowance
          getAllowance();
          doEffect();
        });
    }
  }

  return (
    <>
      {!!account ? <CurrentDeposit vault={vault} address={account} /> : ""}
      <form onSubmit={doSubmit}>
        <input type="submit" value={!!allowance && !allowance.isZero() ? "Deposit" : "Approve"} />
      </form>
    </>
  );
};

export const Vault = ({address, web3Connection}: {address: string} & HasWeb3Connection) => {
  // TODO check for existence of vault instance
  const [vault, setVault] = useState<VaultWrapper | null>(null);
  const [token, setToken] = useState<IERC20Wrapper | null>(null);

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

  return (
    <div>
      <h1>Vault: {address}</h1>
      {!!vault && !!token ?
        <>
          <ActiveSubs vault={vault} />
          <DepositForm vault={vault}
            web3Connection={web3Connection}
            token={token} />
        </> :
        <div>Loading...</div>
      }
    </div>
  );
};
