<script lang="ts" context="module">
  export const SUBSCRIPTION_CONTRACT_CTX = 'subscriptionContract';
  export const SUBSCRIPTION_DATA_CTX = 'subscriptionData';
  export const ERC20_CONTRACT_CTX = 'erc20Contract';
  export const ERC20_DATA_CTX = 'erc20Data';
  export const ERC20_ALLOWANCE_CTX = 'erc20Allowance';
  export const ERC20_BALANCE_CTX = 'erc20Balance';
</script>

<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import type { LayoutData } from './$types';
  import {
    createSubscriptionContract,
    getContractData,
    type SubscriptionContainer,
    type SubscriptionContractData
  } from '$lib/web3/contracts/subscription';
  import { chainEnvironment } from '$lib/chain-context';
  import { derived } from 'svelte/store';
  import { setContext } from 'svelte';
  import {
    getErc20Contract,
    type Erc20Container,
    getErc20Data,
    type Erc20Data,
    getAllowance,
    getBalance
  } from '$lib/web3/contracts/erc20';
  import { currentAccount } from '$lib/web3/onboard';
  import { erc20Keys, subKeys } from '$lib/query/keys';

  export let data: LayoutData;

  const addr = data.subscriptionAddr;

  const subscriptionContract = createQuery<SubscriptionContainer>(
    derived(chainEnvironment, (chainEnvironment) => ({
      queryKey: subKeys.contract(addr),
      queryFn: () => createSubscriptionContract(addr, chainEnvironment!.ethersSigner)
    }))
  );

  const subscriptionData = createQuery<SubscriptionContractData>(
    derived(subscriptionContract, (subscriptionContract) => ({
      queryKey: subKeys.contractUri(addr),
      queryFn: async () => {
        const data = await getContractData(subscriptionContract.data!.contract);
        return data;
      },
      enabled: subscriptionContract.isSuccess
    }))
  );

  const erc20Contract = createQuery<Erc20Container>(
    derived(
      [chainEnvironment, subscriptionData],
      ([chainEnvironment, { isSuccess, data: subData }]) => ({
        queryKey: erc20Keys.contract(subData?.token),
        queryFn: () => getErc20Contract(subData!.token, chainEnvironment!.ethersSigner),
        enabled: isSuccess && !!subData?.token
      })
    )
  );

  const erc20Data = createQuery<Erc20Data>(
    derived(erc20Contract, ({ isSuccess, data }) => ({
      queryKey: erc20Keys.metadata(data?.address),
      queryFn: async () => getErc20Data(data!.contract),
      enabled: isSuccess
    }))
  );

  const erc20Allowance = createQuery<bigint>(
    derived(
      [erc20Contract, subscriptionContract, currentAccount],
      ([{ isSuccess, data: erc20 }, { data: sub }, currentAccount]) => ({
        queryKey: erc20Keys.allowance(erc20?.address, currentAccount, sub?.address),
        queryFn: async () => await getAllowance(erc20!.contract, currentAccount!, sub!.address),
        enabled: isSuccess && !!currentAccount
      })
    )
  );

  const erc20Balance = createQuery<bigint>(
    derived([erc20Contract, currentAccount], ([{ isSuccess, data: erc20 }, currentAccount]) => ({
      queryKey: erc20Keys.balance(erc20?.address, currentAccount!),
      queryFn: async () => await getBalance(erc20!.contract, currentAccount!),
      enabled: isSuccess && !!currentAccount
    }))
  );

  setContext(SUBSCRIPTION_CONTRACT_CTX, subscriptionContract);
  setContext(SUBSCRIPTION_DATA_CTX, subscriptionData);

  setContext(ERC20_CONTRACT_CTX, erc20Contract);
  setContext(ERC20_DATA_CTX, erc20Data);
  setContext(ERC20_ALLOWANCE_CTX, erc20Allowance);
  setContext(ERC20_BALANCE_CTX, erc20Balance);
</script>

<slot />
