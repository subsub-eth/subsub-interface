import React from "react";
import {FileCopy, Link as LinkIcon, Warning, Report, ExpandLess, TrendingFlat}
  from '@mui/icons-material';
import {
  HasAddress, HasToken, HasVaultValues,
} from "../../helper/propTypes";
import * as S from "./VaultStyle";
import copyToClipboad from "../../helper/Clipboard";

const Owner = ({address}: {} & HasAddress) => {
  // TODO create link to etherscan
  const doCopy = () => {
    copyToClipboad(address);
  }
  return (
    <S.OwnerContainer>
      <S.OwnerAddress>
        {address}
      </S.OwnerAddress>
      <S.OwnerCopyButton onClick={doCopy}>
        <FileCopy />
      </S.OwnerCopyButton>
      <S.OwnerButton>
        <LinkIcon />
      </S.OwnerButton>
    </S.OwnerContainer>
  );
}

const Token = ({token}: {} & HasToken) => {
  // TODO create link to etherscan
  // TODO find coin logo or show generic
  return (
    <S.TokenLink href="TODO" title={token.name}>
      <S.TokenImage src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" />
    </S.TokenLink>
  );
};

const VaultStatus = () => {
  // TODO determine vault status from factory data
  return (
    <S.StatusContainer>
      <S.VaultWarning />
      <S.VaultDanger />
    </S.StatusContainer>
  );
}


const VaultMetaActions = ({address}: {} & HasAddress) => {
  const doCopy = () => {
    copyToClipboad(address);
  }
  return (
    <S.MetaActionsContainer>
      <S.VaultCopyButton onClick={doCopy}>
        <FileCopy />
      </S.VaultCopyButton>
      <S.VaultMetaActionButton>
        <ExpandLess />
      </S.VaultMetaActionButton>
    </S.MetaActionsContainer>
  );
}

export const Head = ({token, vault}: {} & HasToken & HasVaultValues) => {
  return (
    <S.Meta>
      <Token token={token} />
      <S.VaultTitle>
        Lorem ipsum dolor sit amet
      </S.VaultTitle>
      <Owner address={vault.owner} />
      <VaultStatus />
      <VaultMetaActions address={vault.address} />
    </S.Meta>
  );
};
