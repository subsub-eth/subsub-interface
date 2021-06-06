import React, {FormEvent, useEffect, useState} from "react";

import {toast} from 'react-toastify';
import {FileCopy, Link as LinkIcon, Warning, Report, ExpandLess, TrendingFlat}
  from '@material-ui/icons';

import BN from "bn.js";
import {bn, zero, fromWei, toWei} from "./util";

import {HasVaultService, HasWeb3Connection, HasAddress, HasToken, HasVaultValues, HasAccount} from "./propTypes";
import {Vault as VaultValues, VaultService} from "./contract/VaultWrapper";
import {IERC20Wrapper} from "./contract/IErc20Wrapper";
import {Address} from "./types";
import * as S from "./VaultStyle";



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


const Owner = () => {
  return (
    <S.OwnerContainer>
      <S.OwnerAddress>
        dherfjeidnekjdhndkpwijfreiuedwqoudbe
      </S.OwnerAddress>
      <S.OwnerCopyButton>
        <FileCopy />
      </S.OwnerCopyButton>
      <S.OwnerButton>
        <LinkIcon />
      </S.OwnerButton>
    </S.OwnerContainer>
  );
}

const Token = ({token}: {} & HasToken) => {
  return (
    <S.TokenLink href="TODO" title="TODO">
      <S.TokenImage src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" />
    </S.TokenLink>
  );
};

const VaultStatus = () => {
  return (
    <S.StatusContainer>
      <S.VaultWarning />
      <S.VaultDanger />
    </S.StatusContainer>
  );
}


const VaultMetaActions = () => {
  return (
    <S.MetaActionsContainer>
      <S.VaultCopyButton>
        <FileCopy />
      </S.VaultCopyButton>
      <S.VaultMetaActionButton>
        <ExpandLess />
      </S.VaultMetaActionButton>
    </S.MetaActionsContainer>
  );
}

const Head = ({token}: {} & HasToken) => {
  return (
    <S.Meta>
      <Token token={token} />
      <S.VaultTitle>
        Lorem ipsum dolor sit amet
      </S.VaultTitle>
      <Owner />
      <VaultStatus />
      <VaultMetaActions />
    </S.Meta>
  );
};


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
      <S.PropertyValue>
        {v.value}
        {v.flagged ? <Warning /> : ""}
      </S.PropertyValue>
      {transitioning ? <S.TransitionArrow /> : ""}
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
            <S.UserProperty>
              {renderVaultPropertyValue(f.values.user, !!f.values.current)}
            </S.UserProperty> : ""}
          {f.values.current ?
            <S.CurrentProperty>
              {renderVaultPropertyValue(f.values.current, !!f.values.upcoming)}
            </S.CurrentProperty> : ""}
          {f.values.upcoming ?
            <S.UpcomingProperty>
              {renderVaultPropertyValue(f.values.upcoming, false)}
            </S.UpcomingProperty> : ""}
        </> :
        <S.FieldProperty>
          {renderVaultPropertyValue(f.values.current, false)}
        </S.FieldProperty>

      return (
        <S.InfoField key={i}>
          <S.InfoFieldLabel>
            {f.label}
            {f.modifier ?
              <S.InfoFieldLabelModifier> / {f.modifier}</S.InfoFieldLabelModifier> :
              ""}
          </S.InfoFieldLabel>
          <S.FieldProperties>
            {values}
          </S.FieldProperties>
        </S.InfoField>
      );
    });

  return (
    <div>
      {fields}
    </div>
  );
};


const VaultStateField = () => {
  return (
    <S.InfoField>
      <S.InfoFieldLabel>
        Lorem
      </S.InfoFieldLabel>
      <S.StateInfoFieldValue>
        Ipsum
      </S.StateInfoFieldValue>
    </S.InfoField>
  );
}

const VaultState = () => {
  return (
    <S.VaultStateContainer>
      <VaultStateField />
      <VaultStateField />
      <VaultStateField />
    </S.VaultStateContainer>
  );
};


const UserDetailsField = () => {
  return (
    <S.UserDetailsFieldContainer>
      <S.UserDetailsLabel>
        Lorem
      </S.UserDetailsLabel>
      <S.UserDetailsValue>
        Ipsum
      </S.UserDetailsValue>
    </S.UserDetailsFieldContainer>
  );
};

const VaultUserDetails = () => {
  return (
    <S.UserDetailsContainer>
      <UserDetailsField />
      <UserDetailsField />
      <UserDetailsField />
      <UserDetailsField />
    </S.UserDetailsContainer>
  );
};

const VaultInfo = () => {
  return (
    <S.InfoContainter>
      <VaultProperties />
      <VaultState />
    </S.InfoContainter>
  );
}


const DepositAction = () => {
  return (
    <S.ActionForm>
      <S.AmountInput type="number" name="deposit" required placeholder="0" />
      <S.InputLabel>Deposit</S.InputLabel>
      <S.ActionButtonContainer>
        <S.GroupedButton type="submit" disabled={true}>Deposit</S.GroupedButton>
        <S.GroupedButton type="submit">Deposit All</S.GroupedButton>
      </S.ActionButtonContainer>
    </S.ActionForm>
  );
};

const WithdrawAction = () => {
  return (
    <S.ActionForm>
      <S.AmountInput type="number" name="deposit" required placeholder="0" />
      <S.InputLabel>Withdraw</S.InputLabel>
      <S.ActionButtonContainer>
        <S.GroupedButton type="submit" disabled={true}>Withdraw</S.GroupedButton>
        <S.GroupedButton type="submit">Withdraw All</S.GroupedButton>
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

const VaultActions = () => {
  return (
    <S.VaultActionsContainer>
      <DepositAction />
      <WithdrawAction />
      <RewardsAction />
    </S.VaultActionsContainer>
  );
};


const VaultNote = () => {
  return (
    <S.Note>
      <S.NoteTitle>Lorem Ipsum</S.NoteTitle>
      <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>
      <ul>
        <li>liquyam erat, sed diam voluptua</li>
        <li>liquyam erat, sed diam voluptua</li>
        <li>liquyam erat, sed diam voluptua</li>
      </ul>
      <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>
    </S.Note>
  );
}

const VaultNotes = () => {
  return (
    <S.NotesContainer>
      <VaultNote />
      <VaultNote />
      <VaultNote />
      <VaultNote />
    </S.NotesContainer>
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
    <S.VaultContainer>
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
    </S.VaultContainer>
  );
}
