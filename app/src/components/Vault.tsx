import React, {FormEvent, useEffect, useState} from "react";
import styled from "styled-components";

import {toast} from 'react-toastify';
import {FileCopy, Link as LinkIcon, Warning, Report, ExpandLess, TrendingFlat}
  from '@material-ui/icons';

import BN from "bn.js";
import {bn, zero, fromWei, toWei} from "./util";

import {HasVaultService, HasWeb3Connection, HasAddress, HasToken, HasVaultValues, HasAccount} from "./propTypes";
import {Vault as VaultValues, VaultService} from "./contract/VaultWrapper";
import {IERC20Wrapper} from "./contract/IErc20Wrapper";
import {Address} from "./types";
import {fontHeadlineH1, resetButton, textEllipsis, fontLabel, fontValue}
  from "./Theme";


const VaultContainer = styled.div`
margin-top: ${props => props.theme.gutter * 4}px;
padding: ${props => props.theme.gutter * 2}px;
border-radius: ${props => props.theme.gutter}px;
background: ${props => props.theme.cardBackground};
box-shadow: 0 0 10px 0 #484545;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  margin-top: ${props => props.theme.gutter * 6}px;
  padding: ${props => props.theme.gutter * 3}px;
}
`;

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

const Meta = styled.div`
display: grid;
grid-template-areas: 'status . actions' 'token title title' 'token owner owner';
grid-template-columns: 64px minmax(0, auto) 80px;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  grid-template-areas: 'token title status actions' 'token owner . .';
  grid-template-columns: 84px auto 70px 100px;
}
`;

const TokenLink = styled.a`
grid-area: token;
align-items: center;
display: grid;
cursor: pointer;
`;

const TokenImage = styled.img`
width: 40px;
height: 40px;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  width: 60px;
  height: 60px;
}
`;

const VaultTitle = styled.h1`
grid-area: title;
${props => fontHeadlineH1(props.theme.minTablet, props.theme.minDesktop)}
${textEllipsis}
`;

const OwnerContainer = styled.div`
grid-area: owner;
font-size: 12px;
display: flex;
align-items: center;

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  font-size: 14px;
}
`;

const OwnerAddress = styled.div`
line-height: 1;
${textEllipsis}
`;

const OwnerButton = styled.button`
${resetButton}
height: 20px;
width: 20px;
display: grid;
place-items: center;
svg {
  font-size: 16px;
}
&:hover {
  border-radius: 4px;
  background-color: ${props => props.theme.secondary};
  color: ${props => props.theme.background};
}
`;

const OwnerCopyButton = styled(OwnerButton)`
margin-left: ${props => props.theme.gutter}px;
margin-right: ${props => props.theme.gutter / 2}px;
`;

const Token = ({token}: {} & HasToken) => {
  return (
    <TokenLink href="TODO" title="TODO">
      <TokenImage src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" />
    </TokenLink>
  );
};

const Owner = () => {
  return (
    <OwnerContainer>
      <OwnerAddress>
        dherfjeidnekjdhndkpwijfreiuedwqoudbe
      </OwnerAddress>
      <OwnerCopyButton>
        <FileCopy />
      </OwnerCopyButton>
      <OwnerButton>
        <LinkIcon />
      </OwnerButton>
    </OwnerContainer>
  );
}

const StatusContainer = styled.div`
grid-area: status;
margin-bottom: ${props => props.theme.gutter}px;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  justify-self: end;
  margin-bottom: 0;
}
`;

const vaultStatusIcon = (minTablet: number) => `
font-size: 28px !important;
@media screen and (min-width: ${minTablet}px) {
  font-size: 32px !important;
}
`;
const VaultWarning = styled(Warning)`
color: ${props => props.theme.cardYellow};
${props => vaultStatusIcon(props.theme.minTablet)}
`;

const VaultDanger = styled(Report)`
color: ${props => props.theme.cardRed};
${props => vaultStatusIcon(props.theme.minTablet)}
`;

const VaultStatus = () => {
  return (
    <StatusContainer>
      <VaultWarning />
      <VaultDanger />
    </StatusContainer>
  );
}

const VaultMetaActionButton = styled.button`
${resetButton}
height: 28px;
width: 28px;
display: grid;
place-items: center;

&:hover {
  border-radius: 4px;
  background-color: ${props => props.theme.secondary};
  color: ${props => props.theme.background}
}
`;

const VaultCopyButton = styled(VaultMetaActionButton)`
margin-right: ${props => props.theme.gutter / 2}px;

svg {
  font-size: 18px;
}
`;

const MetaActionsContainer = styled.div`
grid-area: actions;
justify-self: end;
display: flex;
`;

const VaultMetaActions = () => {
  return (
    <MetaActionsContainer>
      <VaultCopyButton>
        <FileCopy />
      </VaultCopyButton>
      <VaultMetaActionButton>
        <ExpandLess />
      </VaultMetaActionButton>
    </MetaActionsContainer>
  );
}

const Head = ({token}: {} & HasToken) => {
  return (
    <Meta>
      <Token token={token} />
      <VaultTitle>
        Lorem ipsum dolor sit amet
      </VaultTitle>
      <Owner />
      <VaultStatus />
      <VaultMetaActions />
    </Meta>
  );
};

const InfoContainter = styled.div`
${props => props.theme.contentSpacing}
display: grid;
grid-template-columns: 1fr;

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  grid-template-columns: 60% 40%;
  grid-column-gap: ${props => props.theme.gutter * 2}px;
}
`;

const InfoField = styled.div`
display: flex;
flex-direction: column;
margin-top: ${props => props.theme.gutter * 1.5}px;
width: 100%;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  align-items: flex-end;
  flex-direction: row;
  margin-top: ${props => props.theme.gutter * 2}px;
}
`;

const InfoFieldLabel = styled.div`
margin-bottom: ${props => props.theme.gutter}px;
${props => fontLabel(props.theme.minDesktop)}

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  width: ${props => props.theme.vaultInfoLabelWidth}px;
  margin-bottom: 0;
}
`;

const InfoFieldLabelModifier = styled.span`
font-size: 12px;
@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  font-size: 14px;
}
`;

const FieldProperties = styled.div`
display: grid;
grid-template-columns: 3fr 3fr 2fr;
width: 100%;
${props => fontValue(props.theme.minDesktop)}

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  grid-template-columns: repeat(3, 1fr);
  width: calc(100% - ${props => props.theme.vaultInfoLabelWidth}px);
}
`;

const PropertyValue = styled.span`
svg {
  margin-left: 8px;
  vertical-align: -2px;
  font-size: 16px;
  color: ${props => props.theme.cardYellow};

  @media screen and (min-width: ${props => props.theme.minTablet}px) {
    font-size: 18px;
  }
}
`;

const TransitionArrow = styled(TrendingFlat)`
margin-right: ${props => props.theme.gutter}px;
color: ${props => props.theme.secondary};
font-size: 18px;
line-height: 22px;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  margin-right: ${props => props.theme.gutter * 2}px;
  font-size: 22px;
}
`;

const FieldProperty = styled.div`
&:not(:last-child) {
  display: flex;
  justify-content: space-between;
}
`;

const UserProperty = styled(FieldProperty)`
color: ${props => props.theme.cardBlue}
`;
const CurrentProperty = styled(FieldProperty)`
color: ${props => props.theme.cardGreen}
`;
const UpcomingProperty = styled(FieldProperty)`
color: ${props => props.theme.cardRed}
`;

interface VaultPropertyValue {
  value: string;
  flagged: boolean;
}
interface VaultProperty {
  label: string;
  modifier?: string;
  values: {
    user?: VaultPropertyValue,
    current: VaultPropertyValue,
    upcoming?: VaultPropertyValue
  };
}

/**
  * renders a set of transitioning vault properties
*/
const VaultProperties = () => {
  const isTransitioning = (value: VaultProperty) =>
    !!value.values.user || !!value.values.upcoming;

  const renderVaultPropertyValue = (v: VaultPropertyValue,
    transitioning: boolean) =>
    <>
      <PropertyValue>
        {v.value}
        {v.flagged ? <Warning /> : ""}
      </PropertyValue>
      {transitioning ? <TransitionArrow /> : ""}
    </>;

  // TODO hardcoded
  const fields = [
    {
      label: "Lorem", modifier: "ipsum",
      values: {current: {value: "123", flagged: true}}
    },
    {
      label: "Lorem", modifier: "ipsum",
      values: {
        user: {value: "111%", flagged: true},
        current: {value: "123", flagged: true},
        upcoming: {value: "222%", flagged: true}
      }
    }
  ]
  .map((f: VaultProperty, i: number) => {
      const values = isTransitioning(f) ?
        <>
          {f.values.user ?
            <UserProperty>
              {renderVaultPropertyValue(f.values.user, !!f.values.current)}
            </UserProperty> : ""}
          {f.values.current ?
            <CurrentProperty>
              {renderVaultPropertyValue(f.values.current, !!f.values.upcoming)}
            </CurrentProperty> : ""}
          {f.values.upcoming ?
            <UpcomingProperty>
              {renderVaultPropertyValue(f.values.upcoming, false)}
            </UpcomingProperty> : ""}
        </> :
        <FieldProperty>
          {renderVaultPropertyValue(f.values.current, false)}
        </FieldProperty>

      return (
        <InfoField key={i}>
          <InfoFieldLabel>
            {f.label}
            {f.modifier ?
              <InfoFieldLabelModifier> / {f.modifier}</InfoFieldLabelModifier> :
              ""}
          </InfoFieldLabel>
          <FieldProperties>
            {values}
          </FieldProperties>
        </InfoField>
      );
    });

  return (
    <div>
      {fields}
    </div>
  );
};

const VaultStateContainer = styled.div`
@media screen and (max-width: ${props => props.theme.maxMobile}px) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: ${props => props.theme.gutter * 2}px;
  margin-top: ${props => props.theme.gutter * 2}px;
}
`;

const StateInfoFieldValue = styled.div`
width: calc(100% - ${props => props.theme.vaultInfoLabelWidth}px);
${props => fontValue(props.theme.minDesktop)}
`;

const VaultStateField = () => {
  return (
    <InfoField>
      <InfoFieldLabel>
        Lorem
      </InfoFieldLabel>
      <StateInfoFieldValue>
        Ipsum
      </StateInfoFieldValue>
    </InfoField>
  );
}

const VaultState = () => {
  return (
    <VaultStateContainer>
      <VaultStateField />
      <VaultStateField />
      <VaultStateField />
    </VaultStateContainer>
  );
};

const UserDetailsContainer = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
grid-column-gap: ${props => props.theme.gutter * 2}px;
@include content-spacing;

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  grid-template-columns: 2fr 2fr 1fr;
  grid-column-gap: ${props => props.theme.gutter * 4}px;
}
`;

const UserDetailsFieldContainer = styled.div`
display: flex;
flex-direction: column;
margin-top: ${props => props.theme.gutter * 1.5}px;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  flex-direction: row;
  align-items: flex-end;
  margin-top: ${props => props.theme.gutter * 2}px;
}

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  &:nth-child(odd) {
    grid-column: 1 / 2;
  }

  &:nth-child(even) {
    grid-column: 2 / 3;
  } 
}
`;

const UserDetailsLabel = styled.div`
margin-bottom: ${props => props.theme.gutter}px;
width: ${props => props.theme.vaultInfoLabelWidth}px;
${props => fontLabel(props.theme.minDesktop)}

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  margin-bottom: 0;
}
`;
const UserDetailsValue = styled.div`
width: calc(100% - ${props => props.theme.vaultInfoLabelWidth}px);
${props => fontValue(props.theme.minDesktop)}
`;

const UserDetailsField = () => {
  return (
    <UserDetailsFieldContainer>
      <UserDetailsLabel>
        Lorem
      </UserDetailsLabel>
      <UserDetailsValue>
        Ipsum
      </UserDetailsValue>
    </UserDetailsFieldContainer>
  );
};

const VaultUserDetails = () => {
  return (
    <UserDetailsContainer>
      <UserDetailsField />
      <UserDetailsField />
      <UserDetailsField />
      <UserDetailsField />
    </UserDetailsContainer>
  );
};

const VaultInfo = () => {
  return (
    <InfoContainter>
      <VaultProperties />
      <VaultState />
    </InfoContainter>
  );
}

const VaultActionsContainer = styled.div`
margin-top: ${props => props.theme.gutter * 3}px;
display: grid;
align-items: end;
grid-template-columns: 1fr;
grid-row-gap: ${props => props.theme.gutter * 2}px;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  grid-template-columns: 1fr 1fr;
  grid-column-gap: ${props => props.theme.gutter * 2}px;
}

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  margin-top: ${props => props.theme.gutter * 4}px;
  grid-template-columns: 2fr 2fr 1fr;
  grid-column-gap: ${props => props.theme.gutter * 4}px;
}
`;

const AmountInput = styled.input`
height: 43px;
background-color: transparent;
color: ${props => props.theme.secondary};
font-size: 18px;
padding: 0 ${props => props.theme.gutter}px;
border: none;
border-bottom: 1px solid ${props => props.theme.secondary};

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  font-size: 20px;
}

&::placeholder{
  opacity: 0;
}

&:focus {
  outline: none;

  &::placeholder {
    opacity: 1;
  }
}

// Remove number input arrows
&::-webkit-outer-spin-button,
&::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
&[type=number] {
  -moz-appearance: textfield;
}
`;

const topLabel = `
top: -20px;
left: 8px;
font-size: 16px;
`;

const InputLabel = styled.label`
color: #999999; 
font-size: 18px;
font-weight: normal;
position: absolute;
pointer-events: none;
left: 14px;
top: ${props => props.theme.gutter * 2}px;
transition: 0.3s ease all; 
`;

const ActionButtonContainer = styled.div`
display: flex;
justify-content: space-between;
width: 100%;
`;

const ActionButton = styled.button`
${props => props.theme.buttonMixin}
margin-top: ${props => props.theme.gutter * 1.2}px;
`;

const GroupedButton = styled(ActionButton)`
width: 48%;
`;

const ActionForm = styled.form`
display: flex;
flex-direction: column;
background: #ffffff0f;
margin-top: ${props => props.theme.gutter * 2}px;
padding: ${props => props.theme.gutter}px;
border-radius: ${props => props.theme.gutter}px;
position: relative;
min-height: 120px;
justify-content: space-around;

${AmountInput}:focus ~ ${InputLabel} {
  ${topLabel}
}
`;

const DepositAction = () => {
  return (
    <ActionForm>
      <AmountInput type="number" name="deposit" required placeholder="0" />
      <InputLabel>Deposit</InputLabel>
      <ActionButtonContainer>
        <GroupedButton type="submit" disabled={true}>Deposit</GroupedButton>
        <GroupedButton type="submit">Deposit All</GroupedButton>
      </ActionButtonContainer>
    </ActionForm>
  );
};

const WithdrawAction = () => {
  return (
    <ActionForm>
      <AmountInput type="number" name="deposit" required placeholder="0" />
      <InputLabel>Withdraw</InputLabel>
      <ActionButtonContainer>
        <GroupedButton type="submit" disabled={true}>Withdraw</GroupedButton>
        <GroupedButton type="submit">Withdraw All</GroupedButton>
      </ActionButtonContainer>
    </ActionForm>
  );
};

const RewardsAmount = styled.span`
height: 43px;
font-size: 22px;
line-height: 32px;
display: grid;
place-items: center;

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  font-size: 24px;
}
`;

const RewardsLabel = styled(InputLabel)`
${topLabel}
`;

const RewardsAction = () => {
  return (
    <ActionForm>
      <RewardsLabel>Rewards</RewardsLabel>
      <RewardsAmount>$ 200</RewardsAmount>
      <ActionButton type="submit" >Withdraw</ActionButton>
    </ActionForm>
  );
};

const VaultActions = () => {
  return (
    <VaultActionsContainer>
      <DepositAction />
      <WithdrawAction />
      <RewardsAction />
    </VaultActionsContainer>
  );
};

const NotesContainer = styled.div`
margin: ${props => props.theme.gutter * 3}px 0 0;
display: flex;
flex-wrap: wrap;
justify-content: space-between;
opacity: 0.9;
font-size: 12px;
line-height: 1.5;
`;

const Note = styled.div`
margin-top: ${props => props.theme.gutter * 2}px;
flex-basis: 100%;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  flex-basis: 45%;
}

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  margin-top: ${props => props.theme.gutter * 2}px;
  flex-basis: 30%;

  &:nth-of-type(1):last-of-type {
    width: 60%;
  }

  &:nth-of-type(1):nth-last-of-type(2),
  &:nth-of-type(2):last-of-type {
    width: 45%;
  }
}
ul {
  list-style: inside;
}

ul, p {
  margin-top: 8px;
}
`;

const NoteTitle = styled.div`
font-weight: 600;
`;

const VaultNote = () => {
  return (
    <Note>
      <NoteTitle>Lorem Ipsum</NoteTitle>
      <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>
      <ul>
        <li>liquyam erat, sed diam voluptua</li>
        <li>liquyam erat, sed diam voluptua</li>
        <li>liquyam erat, sed diam voluptua</li>
      </ul>
      <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>
    </Note>
  );
}

const VaultNotes = () => {
  return (
    <NotesContainer>
      <VaultNote />
      <VaultNote />
      <VaultNote />
      <VaultNote />
    </NotesContainer>
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
    <>
      <Head token={token} />
      <VaultInfo />
      <VaultUserDetails />
      <VaultActions />
      <VaultNotes />
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
    </>
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
    <VaultContainer>
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
    </VaultContainer>
  );
}
