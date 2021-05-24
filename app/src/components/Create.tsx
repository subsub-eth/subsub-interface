import React, {useEffect, useState, FormEvent} from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { toast } from 'react-toastify';

import {HasWeb3Connection} from "./propTypes";

import {VaultFactoryWrapper} from "./contract/VaultFactoryWrapper";

const VaultCreate = ({web3Connection}: {} & HasWeb3Connection) => {

  const history = useHistory();
  const [factory, setFactory] = useState<VaultFactoryWrapper | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    web3Connection.isConnected()
      .then(setConnected);
  }, [web3Connection]);

  useEffect(() => {
    web3Connection.getVaultFactory()
    .then(fac => {
      console.debug(`setting factory`, fac);
      setFactory(fac);
    })
  }, [web3Connection]);

  const create = (event: FormEvent) => {
    console.log(`creating new contract`);
    event.preventDefault();
    if (!!factory) {
      web3Connection.getAccount()
      .then(acc => factory.create("" + acc, hash => toast.info(`hash: ${hash}`)))
      .then(res => {
        toast.success(`success! ${res}`);
        history.push(`/vault/${res}`);
      }, err => toast.error(`Error! ${err}`));
    }
  };

  return (
    <form onSubmit={create}>
      <input type="submit" value="create" disabled={!connected}/>
    </form>
  );
}

export const Create = ({web3Connection}: {} & HasWeb3Connection) => {
  return (
    <>
      <h1>Create new Vault</h1>
      <VaultCreate web3Connection={web3Connection}/>
    </>
  );
};
