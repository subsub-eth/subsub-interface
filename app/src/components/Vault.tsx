import React, {FormEvent, useEffect, useState} from "react";
import styled from "styled-components";

import {toast} from 'react-toastify';

import BN from "bn.js";
import {bn, zero, fromWei, toWei} from "./util";

import {HasVaultService, HasWeb3Connection, HasAddress, HasToken, HasVaultValues, HasAccount} from "./propTypes";
import {Vault as VaultValues, VaultService} from "./contract/VaultWrapper";
import {IERC20Wrapper} from "./contract/IErc20Wrapper";
import {Address} from "./types";


const ActiveSubs = ({vault}: {} & HasVaultValues) => {

  return (
    <div>active subs: {vault.activeSubs.toString()}</div>
  );
};

const CurrentDeposit = ({currentDeposit}: {currentDeposit: BN}) => {

  return (
    <div>current deposit: {fromWei(currentDeposit)}</div>
  );
};

const WalletBalance = ({walletBalance}: {walletBalance: BN}) => {

  return (
    <div>Available funds: {fromWei(walletBalance)}</div>
  );
};

const DepositForm = ({vault, approve, allowance, currentDeposit,
  deposit, account, walletBalance}: {}
  & HasVaultValues & HasAccount &
  {
    approve: () => void, allowance: BN,
    currentDeposit: BN, deposit: (amount: BN) => void,
    walletBalance: BN
  }) => {

  const [amount, setAmount] = useState("");
  const isApproved = !allowance.isZero();
  const canDeposit = isApproved && !!amount && !walletBalance.isZero();

  const doSubmit = (event: FormEvent) => {
    // do not actually send the form with a page load
    event.preventDefault();

    console.log(`current allowance:`, allowance);
    if (isApproved) {
      const bnAmount = bn(toWei(amount));
      console.debug(`Depositing funds of ${amount.toString()} into vault`,
        vault);
      deposit(bnAmount);
      setAmount("");
    } else {
      // approve funds
      console.debug(`Approving funds to vault`, vault);
      approve();
    }
  }

  const handleDepositInput = (val: string) => {
    const f = Number.parseFloat(val);
    // allow empty string or some float
    if (!val || !Number.isNaN(f)) {
      setAmount(val);
    }
  };


  return (
    <>
      <WalletBalance walletBalance={walletBalance} />
      <CurrentDeposit currentDeposit={currentDeposit} />
      <form onSubmit={doSubmit}>
        <input type="number"
          min="0"
          max={fromWei(walletBalance)}
          step="any"
          value={amount}
          placeholder="0"
          inputMode="decimal"
          disabled={!isApproved}
          onChange={e => handleDepositInput(e.target.value)} />
        <input type="submit"
          disabled={!account || (isApproved && !canDeposit)}
          value={isApproved ? "Deposit" : "Approve"} />
      </form>
    </>
  );
};

const VaultHandler = ({vaultService, vault, token, account, updateVaultValues}:
  {updateVaultValues: () => void}
  & HasVaultService & HasVaultValues & HasToken & HasAccount) => {
  const [allowance, setAllowance] = useState<BN>(zero);
  const [currentDeposit, setCurrentDeposit] = useState<BN>(zero);
  const [walletBalance, setWalletBalance] = useState<BN>(zero);


  const getAllowance = () => {
    if (!!account) {
      token.allowance(account, vault.address)
        .then(setAllowance);
    }
  };

  const getCurrentDeposit = () => {
    if (!!account) {
      console.debug(`Loading current deposit of account`, account);
      vaultService.depositOf(account)
        .then(setCurrentDeposit);
    }
  };

  const getWalletBalance = () => {
    if (!!account) {
      console.debug(`Loading wallet balance of account`, account, token);
      token.balanceOf(account)
        .then(setWalletBalance)
    }
  }

  const approve = () => {
    token
      .approve(vault.address, (hash) => toast.info(`Approval tx: ${hash}`))
      .then(res => {
        console.debug(`Successfully updated allowance`, res);
        toast.success(`Funds approved to vault`);
        // reload allowance
        getAllowance();
      });
  };

  const deposit = (amount: BN) => {
    if (!allowance.isZero()) {
      vaultService.deposit(amount, hash => toast.info(`tx hash: ${hash}`))
        .then(res => {
          console.debug(`Deposited ${amount.toString()} into vault`,
            vaultService, res);
          toast.success(`Deposited ${amount.toString()} into vault`);

          getCurrentDeposit();
          updateVaultValues();
        });
    } else {
      // TODO error
    }
  }

  const deps = [vaultService, vault, token, account];

  useEffect(getAllowance, deps);
  useEffect(getCurrentDeposit, deps);
  useEffect(getWalletBalance, deps);

  return (
    <div>
      <h1>Vault: {vault.address}</h1>
      <ActiveSubs vault={vault} />
      <DepositForm vault={vault}
        allowance={allowance}
        approve={approve}
        currentDeposit={currentDeposit}
        deposit={deposit}
        account={account}
        walletBalance={walletBalance}
      />
    </div>
  );
};


export const Vault = ({address, web3Connection}: {address: string} & HasWeb3Connection) => {
  const [vaultService, setVaultService] =
    useState<VaultService | null>();
  const [token, setToken] = useState<IERC20Wrapper | null>(null);

  const [vaultValues, setVaultValues] = useState<VaultValues | null>();
  const [account, setAccount] = useState<Address | null>(null);

  const getService = async () => {
    try {
      const service = await web3Connection.getVault(address)
      setVaultService(service);
    } catch (error) {
      console.error(`Unable to load vault from address ${address}`, error);
      setVaultService(null);
    }
  };

  const getValues = async () => {
    if (!!vaultService) {
      try {
        const values = await vaultService.getValues();
        setVaultValues(values);
      } catch (error) {
        console.error(`Unable to load vault data from address ${address}`,
          error);
        setVaultValues(null);
      }
    }
  }

  // set vault
  useEffect(() => {
    getService();
  }, [address, web3Connection]);

  useEffect(() => {
    getValues();
  }, [web3Connection, vaultService]);

  // set token
  useEffect(() => {
    if (!!vaultValues) {
      web3Connection.getToken(vaultValues.token)
        .then(setToken);
    }
  }, [address, web3Connection, vaultService, vaultValues]);

  // set account
  useEffect(() => {
    web3Connection.getAccount()
      .then(setAccount);
  }, [web3Connection]);

  return (
    <>
      { vaultService === null || vaultValues === null ?
        <div>Unable to load vault</div> :
        !!vaultService && !!vaultValues && !!token ?
          <VaultHandler
            vaultService={vaultService}
            vault={vaultValues}
            token={token}
            account={account}
            updateVaultValues={getValues}
          /> : <div>Loading...</div>
      }
    </>
  );
}
