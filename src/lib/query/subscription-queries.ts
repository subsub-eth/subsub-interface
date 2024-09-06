import type { Address } from '$lib/web3/contracts/common';
import { derived } from 'svelte/store';
import { chainEnvironment, writableChainEnvironment } from '$lib/chain-context';
import { currentAccount } from '$lib/web3/onboard';
import { erc20Keys, subKeys } from '$lib/query/keys';
import {
  createSubscriptionContract,
  createWritableSubscriptionContract,
  getContractData,
  type Subscription,
  type SubscriptionContractData,
  type WritableSubscription
} from '$lib/web3/contracts/subscription';
import {
  getErc20Contract,
  type Erc20,
  getErc20Data,
  type Erc20Data,
  getAllowance,
  getBalance
} from '$lib/web3/contracts/erc20';
import { createQuery } from '@tanstack/svelte-query';
import { findPrice, type Price } from '$lib/web3/contracts/oracle';
import {
  analyzeSubscriptionContract,
  type WarningMessage
} from '$lib/web3/contracts/subscription-analytics';
import { log } from '$lib/logger';

export function subscriptionQueries(addr: Address) {
  const subscriptionContract = createQuery<Subscription>(
    derived(chainEnvironment, (chainEnvironment) => ({
      queryKey: subKeys.contract(addr),
      queryFn: () => createSubscriptionContract(addr, chainEnvironment!.publicClient)
    }))
  );

  const writableSubscriptionContract = createQuery<WritableSubscription>(
    derived(writableChainEnvironment, (ce) => ({
      queryKey: subKeys.writableContract(addr),
      queryFn: () =>
        createWritableSubscriptionContract(
          addr,
          ce!.publicClient,
          ce!.walletClient
        )
    }))
  );

  const subscriptionData = createQuery<SubscriptionContractData>(
    derived(subscriptionContract, (subscriptionContract) => ({
      queryKey: subKeys.contractUri(addr),
      queryFn: async () => {
        log.debug('Querying contract data for subscription contract', addr);
        const data = await getContractData(subscriptionContract.data!);
        log.debug('Found contract data', data);
        return data;
      },
      enabled: subscriptionContract.isSuccess
    }))
  );

  const erc20Contract = createQuery<Erc20>(
    derived(
      [chainEnvironment, subscriptionData],
      ([chainEnvironment, { isSuccess, data: subData }]) => ({
        queryKey: erc20Keys.contract(subData?.token),
        queryFn: () => getErc20Contract(subData!.token, chainEnvironment!.publicClient),
        enabled: isSuccess && !!subData?.token
      })
    )
  );

  const subscriptionErc20Balance = createQuery<bigint>(
    derived([erc20Contract], ([{ isSuccess, data: erc20 }]) => ({
      queryKey: erc20Keys.balance(erc20?.address, addr),
      queryFn: async () => await getBalance(erc20!, addr),
      enabled: isSuccess && !!currentAccount
    }))
  );

  const erc20Data = createQuery<Erc20Data>(
    derived(erc20Contract, ({ isSuccess, data }) => ({
      queryKey: erc20Keys.metadata(data?.address),
      queryFn: async () => getErc20Data(data!),
      enabled: isSuccess
    }))
  );

  const erc20Allowance = createQuery<bigint>(
    derived(
      [erc20Contract, subscriptionContract, currentAccount],
      ([{ isSuccess, data: erc20 }, { data: sub }, currentAccount]) => ({
        queryKey: erc20Keys.allowance(erc20?.address, currentAccount, sub?.address),
        queryFn: async () => await getAllowance(erc20!, currentAccount!, sub!.address),
        enabled: isSuccess && !!currentAccount
      })
    )
  );

  const erc20Balance = createQuery<bigint>(
    derived([erc20Contract, currentAccount], ([{ isSuccess, data: erc20 }, currentAccount]) => ({
      queryKey: erc20Keys.balance(erc20?.address, currentAccount!),
      queryFn: async () => await getBalance(erc20!, currentAccount!),
      enabled: isSuccess && !!currentAccount
    }))
  );

  const tokenPrice = createQuery<Price | null>(
    derived(
      [erc20Data, chainEnvironment],
      ([{ isSuccess, data: erc20Data }, chainEnvironment]) => ({
        queryKey: erc20Keys.price(erc20Data?.address),
        queryFn: async () =>
          (await findPrice(
            erc20Data!.address,
            chainEnvironment!.chainData.contracts.priceFeeds,
            chainEnvironment!.publicClient
          )) ?? null,
        enabled: isSuccess
      })
    )
  );

  const warnings = createQuery<Array<WarningMessage>>(
    derived(subscriptionData, (subscriptionData) => ({
      queryKey: subKeys.warnings(subscriptionData.data!),
      queryFn: async () => {
        if (subscriptionData.data) {
          // TODO add more analytics functions
          log.debug('Querying warnings for subscription contract', subscriptionData.data);
          const warnings = await analyzeSubscriptionContract(subscriptionData.data);
          log.debug('warnings found', warnings.length);

          return warnings;
        }
        return [];
      },
      enabled: subscriptionData.isSuccess
    }))
  );

  return {
    subscriptionContract,
    writableSubscriptionContract,
    subscriptionData,
    subscriptionErc20Balance,
    erc20Contract,
    erc20Data,
    erc20Allowance,
    erc20Balance,
    tokenPrice,
    warnings
  };
}
