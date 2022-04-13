import React, { FormEvent, useEffect, useState } from "react";
import { useAsync } from "react-async";

import { toast } from 'react-toastify';

import BN from "bn.js";
import { bn, zero, fromWei, toWei } from "../../helper/util";

import {
  HasVaultService, HasWeb3Connection, HasAddress, HasCurrentDeposit,
  HasToken, HasTokenService, HasVaultValues, HasAccount, HasAllowance, HasWalletBalance
} from "../../helper/propTypes";
import { Vault as VaultValues, VaultService } from "../../contract/VaultWrapper";
import { ERC20Token, ERC20Wrapper } from "../../contract/Erc20Wrapper";

import { Address } from "../../helper/types";
import { Head } from "./Head";
import { VaultUserDetails } from "./UserDetails"
import { VaultInfo } from "./Info"
import { VaultActions } from "./Actions"
import { VaultNotes } from "./Notes"

import * as S from "./VaultStyle";
import { useRecoilValue } from "recoil";
import { useRefreshVaultDeposit, useRefreshVaultValues, vaultAddressState, vaultDepositState, vaultServiceState, vaultValuesState } from "../../state/vaultState";
import { web3State } from "../../state/web3State";
import { tokenAllowanceState, tokenBalanceState, useRefreshTokenAllowance, useRefreshTokenBalance } from "../../state/erc20TokenState";


const VaultHandler = ({ vaultService, vault, token, tokenService, account, updateVaultValues }:
  { updateVaultValues: () => void }
  & HasVaultService & HasVaultValues & HasToken & HasTokenService & HasAccount) => {
  const allowance = useRecoilValue(tokenAllowanceState({
    address: token.address,
    spender: vault.address
  }));
  const refreshAllowance = useRefreshTokenAllowance(token.address);

  const currentDeposit = useRecoilValue(vaultDepositState(vault.address));
  const refreshDeposit = useRefreshVaultDeposit(vault.address);

  const walletBalance = useRecoilValue(tokenBalanceState(token.address))
  const refreshWalletBalance = useRefreshTokenBalance(token.address)

  const approve = async () => {
    return tokenService
      .approve(vault.address, (hash) => toast.info(`Approval tx: ${hash}`))
      .then(res => {
        console.debug(`Successfully updated allowance`, res);
        toast.success(`Funds approved to vault`);
        // reload allowance
        refreshAllowance();
      });
  };

  const deposit = async (amount: BN) => {
    if (!allowance.isZero()) {
      return vaultService.deposit(amount, hash => toast.info(`tx hash: ${hash}`))
        .then(res => {
          console.debug(`Deposited ${amount.toString()} into vault`,
            vaultService, res);
          toast.success(`Deposited ${amount.toString()} into vault`);

          refreshDeposit();
          refreshWalletBalance();
          updateVaultValues();
        });
    } else {
      // TODO error
      return Promise.reject("deposit error");
    }
  }

  const withdraw = async (amount: BN) => {
    if (!currentDeposit.isZero()) {
      return vaultService.withdraw(amount, hash => toast.info(`tx hash: ${hash}`))
        .then(res => {
          console.debug(`Withdrew ${amount.toString()} from vault`,
            vaultService, res);
          toast.success(`Withdrew ${amount.toString()} from vault`);

          refreshDeposit();
          refreshWalletBalance();
          updateVaultValues();
        });
    } else {
      // TODO
      return Promise.reject("withdraw error");
    }
  };

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


export const Vault = ({address}: HasAddress) => {
  const web3Connection = useRecoilValue(web3State)
  const vaultService = useRecoilValue(vaultServiceState(address));
  const vaultValues = useRecoilValue(vaultValuesState(address));

  const refreshVaultValues = () => {
    console.debug(`Refreshing values of vault`, address);
    useRefreshVaultValues(address);
  }


  const [tokenService, setTokenService] = useState<ERC20Wrapper | null>(null);
  const [token, setToken] = useState<ERC20Token | null>(null);

  const [account, setAccount] = useState<Address | null>(null);

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
      {vaultService === null || vaultValues === null ?
        <div>Unable to load vault</div> :
        !!vaultService && !!vaultValues && !!tokenService && !!token ?
          <VaultHandler
            vaultService={vaultService}
            vault={vaultValues}
            token={token}
            tokenService={tokenService}
            account={account}
            updateVaultValues={refreshVaultValues}
          /> : <div>Loading...</div>
      }
    </S.VaultContainer>
  );
}
