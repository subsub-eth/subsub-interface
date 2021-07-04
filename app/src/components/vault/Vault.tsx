import React, {FormEvent, useEffect, useState} from "react";
import {useAsync} from "react-async";

import {toast} from 'react-toastify';

import BN from "bn.js";
import {bn, zero, fromWei, toWei} from "../util";

import {
  HasVaultService, HasWeb3Connection, HasAddress, HasCurrentDeposit,
  HasToken, HasTokenService, HasVaultValues, HasAccount, HasAllowance, HasWalletBalance
} from "../propTypes";
import {Vault as VaultValues, VaultService} from "../contract/VaultWrapper";
import {ERC20Token, ERC20Wrapper} from "../contract/Erc20Wrapper";

import {Address} from "../types";
import {Head} from "./Head";
import {VaultUserDetails} from "./UserDetails"
import {VaultInfo} from "./Info"
import {VaultActions} from "./Actions"
import {VaultNotes} from "./Notes"

import * as S from "./VaultStyle";


const VaultHandler = ({vaultService, vault, token, tokenService, account, updateVaultValues}:
  {updateVaultValues: () => void}
  & HasVaultService & HasVaultValues & HasToken & HasTokenService & HasAccount) => {
  const [allowance, setAllowance] = useState<BN>(zero);
  const [currentDeposit, setCurrentDeposit] = useState<BN>(zero);
  const [walletBalance, setWalletBalance] = useState<BN>(zero);


  const getAllowance = () => {
    if (!!account) {
      tokenService.allowance(account, vault.address)
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
      console.debug(`Loading wallet balance of account`, account, tokenService);
      tokenService.balanceOf(account)
        .then(setWalletBalance)
    }
  }

  const approve = () => {
    return tokenService
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
      return vaultService.deposit(amount, hash => toast.info(`tx hash: ${hash}`))
        .then(res => {
          console.debug(`Deposited ${amount.toString()} into vault`,
            vaultService, res);
          toast.success(`Deposited ${amount.toString()} into vault`);

          getCurrentDeposit();
          updateVaultValues();
        });
    } else {
      // TODO error
      return Promise.reject("deposit error");
    }
  }

  const withdraw = (amount: BN) => {
    if (!currentDeposit.isZero()) {
      return vaultService.withdraw(amount, hash => toast.info(`tx hash: ${hash}`))
        .then(res => {
          console.debug(`Withdrew ${amount.toString()} from vault`,
            vaultService, res);
          toast.success(`Withdrew ${amount.toString()} from vault`);

          getCurrentDeposit();
          updateVaultValues();
        });
    } else {
      // TODO
      return Promise.reject("withdraw error");
    }
  };

  const deps = [vaultService, vault, tokenService, account];

  useEffect(getAllowance, deps);
  useEffect(getCurrentDeposit, deps);
  useEffect(getWalletBalance, deps);

  return (
    <>
      <Head token={token} vault={vault} />
      <VaultInfo vault={vault} />
      <VaultUserDetails walletBalance={walletBalance} currentDeposit={currentDeposit} />
      <VaultActions allowance={allowance} currentDeposit={currentDeposit}
        approve={approve} walletBalance={walletBalance} deposit={deposit}
        withdraw={withdraw} />
      <VaultNotes />
    </>
  );
};


export const Vault = ({address, web3Connection}: {address: string} & HasWeb3Connection) => {
  const [vaultService, setVaultService] =
    useState<VaultService | null>();
  const [tokenService, setTokenService] = useState<ERC20Wrapper | null>(null);
  const [token, setToken] = useState<ERC20Token | null>(null);

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
        .then(s => {
          setTokenService(s)
          s.getValues().then(setToken)
        });
    }
  }, [address, web3Connection, vaultService, vaultValues]);

  // set account
  useEffect(() => {
    web3Connection.getAccount()
      .then(setAccount);
  }, [web3Connection]);

  return (
    <S.VaultContainer>
      { vaultService === null || vaultValues === null ?
        <div>Unable to load vault</div> :
        !!vaultService && !!vaultValues && !!tokenService && !!token ?
          <VaultHandler
            vaultService={vaultService}
            vault={vaultValues}
            token={token}
            tokenService={tokenService}
            account={account}
            updateVaultValues={getValues}
          /> : <div>Loading...</div>
      }
    </S.VaultContainer>
  );
}
