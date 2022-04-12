import React from "react";
import {
  HasCurrentDeposit,  HasWalletBalance
} from "../propTypes";
import * as S from "./VaultStyle";

import {fromWei} from "../util";

const UserDetailsField = ({name, value}: {name: string, value: string}) => {
  return (
    <S.UserDetailsFieldContainer>
      <S.UserDetailsLabel>
        {name}
      </S.UserDetailsLabel>
      <S.UserDetailsValue>
        {value}
      </S.UserDetailsValue>
    </S.UserDetailsFieldContainer>
  );
};

export const VaultUserDetails = ({walletBalance, currentDeposit}:
  {} & HasWalletBalance & HasCurrentDeposit) => {
  return (
    <S.UserDetailsContainer>
      <UserDetailsField name="Wallet Balance" value={fromWei(walletBalance)} />
      <UserDetailsField name="Current Deposit" value={fromWei(currentDeposit)} />
    </S.UserDetailsContainer>
  );
};
