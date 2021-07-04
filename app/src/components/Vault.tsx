import React, {FormEvent, useEffect, useState} from "react";
import {useAsync} from "react-async";

import {toast} from 'react-toastify';
import {FileCopy, Link as LinkIcon, Warning, Report, ExpandLess, TrendingFlat}
  from '@material-ui/icons';

import BN from "bn.js";
import {bn, zero, fromWei, toWei} from "./util";

import {
  HasVaultService, HasWeb3Connection, HasAddress, HasCurrentDeposit,
  HasToken, HasTokenService, HasVaultValues, HasAccount, HasAllowance, HasWalletBalance
} from "./propTypes";
import {Vault as VaultValues, VaultService} from "./contract/VaultWrapper";
import {ERC20Token, ERC20Wrapper} from "./contract/Erc20Wrapper";
import {Address} from "./types";
import * as S from "./VaultStyle";
import copyToClipboad from "./Clipboard";


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

const Head = ({token, vault}: {} & HasToken & HasVaultValues) => {
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


const VaultStateField = ({name, value}: {name: string, value: string}) => {
  return (
    <S.InfoField>
      <S.InfoFieldLabel>
        {name}
      </S.InfoFieldLabel>
      <S.StateInfoFieldValue>
        {value}
      </S.StateInfoFieldValue>
    </S.InfoField>
  );
}

const VaultState = ({vault}: {} & HasVaultValues) => {
  return (
    <S.VaultStateContainer>
      <VaultStateField name="Active Subs" value={vault.activeSubs.toString()} />
    </S.VaultStateContainer>
  );
};


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

const VaultUserDetails = ({walletBalance, currentDeposit}:
  {} & HasWalletBalance & HasCurrentDeposit) => {
  return (
    <S.UserDetailsContainer>
      <UserDetailsField name="Wallet Balance" value={fromWei(walletBalance)} />
      <UserDetailsField name="Current Deposit" value={fromWei(currentDeposit)} />
    </S.UserDetailsContainer>
  );
};

const VaultInfo = ({vault}: {} & HasVaultValues) => {
  return (
    <S.InfoContainter>
      <VaultProperties />
      <VaultState vault={vault} />
    </S.InfoContainter>
  );
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

const VaultActions = ({allowance, walletBalance, currentDeposit, approve, deposit, withdraw}:
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
