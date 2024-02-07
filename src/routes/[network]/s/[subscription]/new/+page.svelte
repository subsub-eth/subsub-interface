<script lang="ts">
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import {
    CurrentAccountContext,
    ERC20AllowanceContext,
    ERC20BalanceContext,
    ERC20Context,
    EthersContext,
    SubscriptionContractContext,
    SubscriptionContractMetadataContext
  } from '$lib/components/context/web3';
  import MintSubscriptionForm from '$lib/components/subscription/action/MintSubscriptionForm.svelte';
  import {
    mint,
    type SubscriptionContainer,
    type SubscriptionContractData
  } from '$lib/web3/contracts/subscription';
  import { approveFunc, type Erc20Data, type Erc20Container } from '$lib/web3/contracts/erc20';
  import toast from '$lib/toast';
  import type { QueryResult } from '$lib/query/config';
  import { getContext } from 'svelte';
  import {
    ERC20_ALLOWANCE_CTX,
    ERC20_BALANCE_CTX,
    ERC20_CONTRACT_CTX,
    ERC20_DATA_CTX,
    SUBSCRIPTION_CONTRACT_CTX,
    SUBSCRIPTION_DATA_CTX
  } from '../+layout.svelte';

  export let data: PageData;

  const addr = data.subscriptionAddr;

  const onMinted = async (ev: CustomEvent<[bigint, string]>) => {
    const [id, hash] = ev.detail;
    toast.info(`New Subscription minted: ${id} in ${hash}`);
    goto($page.url.pathname + '../' + id);
  };

  const toastMessage = (message: string) => toast.info(message);

  const subscriptionContract =
    getContext<QueryResult<SubscriptionContainer>>(SUBSCRIPTION_CONTRACT_CTX);

  const subscriptionData = getContext<QueryResult<SubscriptionContractData>>(SUBSCRIPTION_DATA_CTX);

  const erc20Contract = getContext<QueryResult<Erc20Container>>(ERC20_CONTRACT_CTX);
  const erc20Data = getContext<QueryResult<Erc20Data>>(ERC20_DATA_CTX);

  const erc20Allowance = getContext<QueryResult<bigint>>(ERC20_ALLOWANCE_CTX);
  const erc20Balance = getContext<QueryResult<bigint>>(ERC20_BALANCE_CTX);
</script>

<h1>Mint new Subscription Token</h1>

<MintSubscriptionForm
  {allowance}
  {balance}
  mint={mint(subscriptionContract, currentAccount)}
  approve={approveFunc(token, addr)}
  {update}
  on:minted={onMinted}
  on:approved={(ev) => toastMessage(`Amount approved`)}
  on:mintTxSubmitted={(ev) => toast.info(`Mint Transaction submitted: ${ev.detail}`)}
  on:approvalTxSubmitted={(ev) => toast.info(`Approval Transaction submitted: ${ev.detail}`)}
  on:txFailed={(ev) => toast.error(`Transaction failed: ${ev.detail}`)}
></MintSubscriptionForm>
