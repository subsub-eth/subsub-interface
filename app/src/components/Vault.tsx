import React, {FormEvent, useEffect, useState} from "react";
import styled from "styled-components";

import {toast} from 'react-toastify';

import BN from "bn.js";
import {bn, zero} from "./util";

import {HasVault, HasWeb3Connection, HasAddress, HasToken, HasVaultValues, HasAccount} from "./propTypes";
import {Vault as VaultValues, VaultWrapper} from "./contract/VaultWrapper";
import {IERC20Wrapper} from "./contract/IErc20Wrapper";
import {Address} from "./types";


// TODO refactor to aggregated function
const ActiveSubs = ({vaultValues}: {} & HasVaultValues) => {

  return (
    <div>active subs: {vaultValues.activeSubs.toString()}</div>
  );
};

const CurrentDeposit = ({currentDeposit}: {currentDeposit: BN}) => {

  return (
    <div>current deposit: {currentDeposit.toString()}</div>
  );
};

const DepositForm = ({vaultValues, approve, allowance, currentDeposit, deposit}: {}
  & HasVaultValues &
{
  approve: () => void, allowance: BN,
  currentDeposit: BN, deposit: (amount: BN) => void
}) => {

  const doSubmit = (event: FormEvent) => {
    // do not actually send the form with a page load
    event.preventDefault();

    console.log(`current allowance:`, allowance);
    if (!allowance.isZero()) {
      // TODO deposit
      const amount = bn(1000);
      console.debug(`Depositing funds of ${amount.toString()} into vault`,
        vaultValues);
      deposit(amount);
    } else {
      // approve funds
      console.debug(`Approving funds to vault`, vaultValues);
      approve();
    }
  }

  return (
    <>
      <CurrentDeposit currentDeposit={currentDeposit} />
      <form onSubmit={doSubmit}>
        <input type="submit" value={!!allowance && !allowance.isZero() ? "Deposit" : "Approve"} />
      </form>
    </>
  );
};

const VaultHandler = ({vault, vaultValues, token, account, updateVaultValues}:
  {updateVaultValues: () => void}
  & HasVault & HasVaultValues & HasToken & HasAccount) => {
  const [allowance, setAllowance] = useState<BN>(zero);
  const [currentDeposit, setCurrentDeposit] = useState<BN>(zero);


  const getAllowance = () => {
    if (!!account) {
      token.allowance(account, vaultValues.address)
        .then(setAllowance);
    }
  };

  const getCurrentDeposit = () => {
    if (!!account) {
      console.debug(`Loading current deposit of account`, account);
      vault.depositOf(account)
        .then(setCurrentDeposit);
    }
  };

  const approve = () => {
      token
        .approve(vaultValues.address, (hash) => toast.info(`Approval tx: ${hash}`))
        .then(res => {
          console.debug(`Successfully updated allowance`, res);
          toast.success(`Funds approved to vault`);
          // reload allowance
          getAllowance();
        });
  };

  const deposit = (amount: BN) => {
    if (!allowance.isZero()) {
      vault.deposit(amount, hash => toast.info(`tx hash: ${hash}`))
        .then(res => {
          console.debug(`Deposited ${amount.toString()} into vault`,
            vault, res);
          toast.success(`Deposited ${amount.toString()} into vault`);

          getCurrentDeposit();
          updateVaultValues();
        });
    } else {
      // TODO error
    }
  }

  const deps = [vault, vaultValues, token, account];

  useEffect(getAllowance, deps);
  useEffect(getCurrentDeposit, deps);

  return (
    <div>
      <h1>Vault: {vaultValues.address}</h1>
      <ActiveSubs vaultValues={vaultValues} />
      <DepositForm vaultValues={vaultValues}
        allowance={allowance}
        approve={approve}
        currentDeposit={currentDeposit}
        deposit={deposit}
      />
    </div>
  );
};


export const Vault = ({address, web3Connection}: {address: string} & HasWeb3Connection) => {
  const [vault, setVault] = useState<VaultWrapper | null>(null);
  const [token, setToken] = useState<IERC20Wrapper | null>(null);

  const [vaultValues, setVaultValues] = useState<VaultValues | null>(null);
  const [account, setAccount] = useState<Address | null>(null);

  const getValues = () => {
    if (!!vault) {
      vault.getValues()
        .then(setVaultValues);
    }
  }

  // set vault
  useEffect(() => {
    web3Connection.getVault(address)
      .then(setVault);
  }, [address, web3Connection]);

  // set token
  useEffect(() => {
    if (!!vault) {
      vault.token()
        .then(tokenAddress => web3Connection.getToken(tokenAddress)
          .then(setToken));
    }
  }, [address, web3Connection, vault]);

  // set account
  useEffect(() => {
    web3Connection.getAccount().then(setAccount);
  }, [web3Connection]);

  useEffect(() => {
    getValues();
  }, [web3Connection, vault]);

  return (
    <>
      {!!vault && !!vaultValues && !!token ?
        <VaultHandler
          vault={vault}
          vaultValues={vaultValues}
          token={token}
          account={account}
          updateVaultValues={getValues}
        /> : <div>Loading..., </div>
      }
    </>
  );
}
