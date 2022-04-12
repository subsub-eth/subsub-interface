import React, {useEffect, useState, FormEvent} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { toast } from 'react-toastify';

import {VaultFactoryWrapper} from "../contract/VaultFactoryWrapper";
import { useRecoilValue } from "recoil";
import { getAccountQuery, isConnectedQuery, web3State } from "../state/web3State";

const VaultCreate = () => {

  const navigate = useNavigate();
  const web3Connection = useRecoilValue(web3State);
  const connected = useRecoilValue(isConnectedQuery);
  const acc = useRecoilValue(getAccountQuery);
  const [factory, setFactory] = useState<VaultFactoryWrapper | null>(null);


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
      factory.create("" + acc, hash => toast.info(`hash: ${hash}`))
      .then(res => {
        toast.success(`success! ${res}`);
        navigate(`/vault/${res}`);
      }, err => toast.error(`Error! ${err}`));
    }
  };

  return (
    <form onSubmit={create}>
      <input type="submit" value="create" disabled={!connected}/>
    </form>
  );
}

export const Create = () => {
  return (
    <>
      <h1>Create new Vault</h1>
      <VaultCreate />
    </>
  );
};
