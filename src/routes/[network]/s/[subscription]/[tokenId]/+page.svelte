<script lang="ts">
  import { SubscriptionDetails } from '$lib/components/subscription/token';
  import type { PageData } from './$types';
  import SubscriptionDeposit from '$lib/components/subscription/action/SubscriptionDeposit.svelte';
  import SubscriptionWithdrawal from '$lib/components/subscription/action/SubscriptionWithdrawal.svelte';
  import {
    cancel,
    renew,
    withdraw,
    tip,
    type SubscriptionContractData,
    type SubscriptionData,
    getSubscriptionData,
    type SubscriptionContainer
  } from '$lib/web3/contracts/subscription';
  import { approveFunc, type Erc20Container, type Erc20Data } from '$lib/web3/contracts/erc20';
  import { createQuery } from '@tanstack/svelte-query';
  import { derived } from 'svelte/store';
  import { queryClient, type QueryResult } from '$lib/query/config';
  import { getContext } from 'svelte';
  import {
    ERC20_ALLOWANCE_CTX,
    ERC20_BALANCE_CTX,
    ERC20_CONTRACT_CTX,
    ERC20_DATA_CTX,
    SUBSCRIPTION_CONTRACT_CTX,
    SUBSCRIPTION_DATA_CTX,

    TOKEN_PRICE_CTX

  } from '../+layout.svelte';
  import toast from '$lib/toast';
  import { currentAccount } from '$lib/web3/onboard';
  import { erc20Keys, subKeys } from '$lib/query/keys';
    import type { Price } from '$lib/web3/contracts/oracle';

  export let data: PageData;

  const addr = data.subscriptionAddr;
  const tokenId = data.tokenId;

  const subDataQueryKey = subKeys.tokenUri(addr, tokenId);

  const subscriptionContract =
    getContext<QueryResult<SubscriptionContainer>>(SUBSCRIPTION_CONTRACT_CTX);

  const subscriptionContractData =
    getContext<QueryResult<SubscriptionContractData>>(SUBSCRIPTION_DATA_CTX);

  const subscriptionData = createQuery<SubscriptionData>(
    derived(subscriptionContract, (subscriptionContract) => ({
      queryKey: subDataQueryKey,
      queryFn: async () => await getSubscriptionData(subscriptionContract.data!.contract, tokenId),
      enabled: subscriptionContract.isSuccess
    }))
  );

  const erc20Contract = getContext<QueryResult<Erc20Container>>(ERC20_CONTRACT_CTX);
  const erc20Data = getContext<QueryResult<Erc20Data>>(ERC20_DATA_CTX);
  const erc20Allowance = getContext<QueryResult<bigint>>(ERC20_ALLOWANCE_CTX);
  const erc20Balance = getContext<QueryResult<bigint>>(ERC20_BALANCE_CTX);
  const tokenPrice = getContext<QueryResult<Price | null>>(TOKEN_PRICE_CTX);

  const invalidateErc20Approval = () =>
    queryClient.invalidateQueries({
      queryKey: erc20Keys.allowance(
        $erc20Contract!.data!.address,
        $currentAccount!,
        $subscriptionContract!.data!.address
      )
    });

  const invalidateBalances = () => {
    invalidateErc20Approval();

    queryClient.invalidateQueries({
      queryKey: erc20Keys.balance($erc20Contract!.data!.address, $currentAccount!)
    });

    queryClient.invalidateQueries({
      queryKey: subDataQueryKey
    });
  };
</script>

<h1>Subscription Details</h1>

<div>
  {#if $subscriptionContract.isSuccess && $subscriptionContractData.isSuccess && $subscriptionData.isSuccess && $erc20Contract.isSuccess && $erc20Data.isSuccess && $erc20Allowance.isSuccess && $erc20Balance.isSuccess}
    {@const subContract = $subscriptionContract.data.contract}
    {@const contractData = $subscriptionContractData.data}
    {@const erc20 = $erc20Contract.data.contract}
    {@const erc20Data = $erc20Data.data}
    <div>
      <!-- LEFT -->
      <!-- TODO proper details -->
      {#if $subscriptionData.isPending}
        Loading...
      {/if}
      {#if $subscriptionData.isError}
        Failed to load subscription
      {/if}
      {#if $subscriptionData.isSuccess}
        <SubscriptionDetails
          subscriptionData={$subscriptionData.data}
          rate={contractData.rate}
          paymentToken={erc20Data}
          tokenPrice={$tokenPrice}
        />
      {/if}
      <!-- Subscription token details -->
      <!-- sub contract details -->
      <!-- Contract owner teaser -->
    </div>

    <div>
      <!-- RIGHT -->

      <!-- subscription controls -->
      <!-- deposit(renew) / tip -->
      <!-- withdraw / cancel -->
      <SubscriptionDeposit
        {tokenId}
        allowance={$erc20Allowance.data}
        balance={$erc20Balance.data}
        approve={approveFunc(erc20, addr)}
        renew={renew(subContract, tokenId)}
        tip={tip(subContract, tokenId)}
        rate={BigInt($subscriptionContractData.data?.rate)}
        on:approved={({ detail: [amount, tx] }) => {
          invalidateErc20Approval();
          toast.info(`Token approved for ${amount} in Tx ${tx}`);
        }}
        on:deposited={({ detail: [amount, tx] }) => {
          invalidateBalances();
          toast.info(`Token approved for ${amount} in Tx ${tx}`);
        }}
        on:txFailed={({ detail: err }) => {
          toast.error(`Transaction failed: ${err}`);
        }}
      />
      <!-- multiplier for rate necessary? -->

      <!-- TODO: disable when not owner -->
      <SubscriptionWithdrawal
        {tokenId}
        withdraw={withdraw(subContract, tokenId)}
        cancel={cancel(subContract, tokenId)}
        withdrawable={BigInt($subscriptionData.data.withdrawable)}
        deposited={BigInt($subscriptionData.data.deposited)}
        on:txFailed={({ detail: err }) => {
          toast.error(`Transaction failed: ${err}`);
        }}
        on:withdrawn={({ detail: [amount, tx] }) => {
          invalidateBalances();
          toast.info(`Token approved for ${amount} in Tx ${tx}`);
        }}
        on:withdrawTxSubmitted={({ detail: tx }) => toast.info(`Withdrawal submitted in Tx ${tx}`)}
      />
    </div>
  {/if}
</div>
