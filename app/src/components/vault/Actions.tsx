import React, {FormEvent, useEffect, useState} from "react";
import {useAsync} from "react-async";

import {
  HasCurrentDeposit, HasAllowance, HasWalletBalance
} from "../propTypes";

import * as S from "./VaultStyle";

import {bn, zero, fromWei, toWei} from "../util";

interface DoApprove {
  approve: () => Promise<void>
}

interface DoDeposit {
  deposit: (amount: BN) => Promise<void>
}

interface DoWithdraw {
  withdraw: (amount: BN) => Promise<void>
}

interface DoWithdrawAll {
  withdrawAll: () => Promise<void>
}

const DepositAction = ({allowance, walletBalance, approve, deposit}:
  {} & HasAllowance & HasWalletBalance & DoApprove & DoDeposit) => {
  const [amount, setAmount] = useState<string>("");
  const hasAllowance = zero.lt(allowance);
  const hasBalance = zero.lt(walletBalance);
  const appr = useAsync({deferFn: approve});
  const dep = useAsync({
    deferFn: async ([a]) => {
      const res = await deposit(a);
      setAmount("");
      return res;
    }
  });


  const submitApprove = (ev: FormEvent) => {
    ev.preventDefault();
    console.debug(`Approving funds`);
    appr.run();
  };

  const submitDeposit = (ev: FormEvent) => {
    ev.preventDefault();
    const a = bn(toWei(amount));
    console.debug(`Depositing ${a.toString()} amount`);
    dep.run(a);
  }

  const submitDepositAll = (ev: FormEvent) => {
    ev.preventDefault();
    console.debug(`Depositing wallet balance ${walletBalance.toString()}`);
    dep.run(walletBalance);
  }


  const handleDepositInput = (val: string) => {
    const f = Number.parseFloat(val);
    // allow empty string or some float
    if (!val || !Number.isNaN(f)) {
      setAmount(val);
    }
  };

  const submit = !hasAllowance ? submitApprove : submitDeposit;

  return (
    <S.ActionForm onSubmit={submit}>
      <S.AmountInput type="number"
        name="deposit"
        min="0"
        max={fromWei(walletBalance)}
        step="any"
        inputMode="decimal"
        required={hasAllowance}
        disabled={!hasAllowance || !hasBalance}
        value={amount}
        onChange={e => handleDepositInput(e.target.value)}
        onWheel={e => false}
        placeholder="0" />
      <S.InputLabel>Deposit</S.InputLabel>
      <S.ActionButtonContainer>
        {!hasAllowance ?
          <S.GroupedButton type="submit" disabled={appr.status !== "initial"}>Approve</S.GroupedButton> :
          <S.GroupedButton type="submit" disabled={!hasBalance}>Deposit</S.GroupedButton>
        }
        <S.GroupedButton onClick={submitDepositAll} disabled={!hasAllowance || !hasBalance}>Deposit All</S.GroupedButton>
      </S.ActionButtonContainer>
    </S.ActionForm>
  );
};

const WithdrawAction = ({currentDeposit, withdraw}:
  {} & HasCurrentDeposit & DoWithdraw) => {
  const [amount, setAmount] = useState<string>("");
  const hasDeposit = zero.lt(currentDeposit);
  const withdr = useAsync({
    deferFn: async ([a]) => {
      const res = await withdraw(a);
      setAmount("");
      return res;
    }
  });

  const handleWithdrawInput = (val: string) => {
    const f = Number.parseFloat(val);
    // allow empty string or some float
    if (!val || !Number.isNaN(f)) {
      setAmount(val);
    }
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();

    const a = bn(toWei(amount));
    withdr.run(a);
  };

  const submitWithdrawAll = (ev: FormEvent) => {
    ev.preventDefault();
    // TODO
  };

  return (
    <S.ActionForm onSubmit={submit}>
      <S.AmountInput type="number"
        name="withdraw"
        min="0"
        max={fromWei(currentDeposit)}
        step="any"
        inputMode="decimal"
        required={hasDeposit}
        disabled={!hasDeposit}
        value={amount}
        onChange={e => handleWithdrawInput(e.target.value)}
        placeholder="0" />
      <S.InputLabel>Withdraw</S.InputLabel>
      <S.ActionButtonContainer>
        <S.GroupedButton type="submit" disabled={!hasDeposit}>Withdraw</S.GroupedButton>
        <S.GroupedButton onClick={submitWithdrawAll} disabled={!hasDeposit}>Withdraw All</S.GroupedButton>
      </S.ActionButtonContainer>
    </S.ActionForm>
  );
};



const RewardsAction = () => {
  return (
    <S.ActionForm>
      <S.RewardsLabel>Rewards</S.RewardsLabel>
      <S.RewardsAmount>$ 200</S.RewardsAmount>
      <S.ActionButton type="submit" >Withdraw</S.ActionButton>
    </S.ActionForm>
  );
};

export const VaultActions = ({allowance, walletBalance, currentDeposit, approve, deposit, withdraw}:
  {} & HasAllowance & HasWalletBalance & HasCurrentDeposit & DoApprove & DoDeposit & DoWithdraw) => {
  return (
    <S.VaultActionsContainer>
      <DepositAction allowance={allowance} approve={approve}
        walletBalance={walletBalance} deposit={deposit} />
      <WithdrawAction currentDeposit={currentDeposit} withdraw={withdraw} />
      <RewardsAction />
    </S.VaultActionsContainer>
  );
};
