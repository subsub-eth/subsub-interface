<script lang="ts">
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import MintSubscriptionForm from '$lib/components/subscription/action/MintSubscriptionForm.svelte';
  import {
    mint,
    type SubscriptionContainer,
    type SubscriptionContractData
  } from '$lib/web3/contracts/subscription';
  import { approveFunc, type Erc20Data, type Erc20Container } from '$lib/web3/contracts/erc20';
  import toast from '$lib/toast';
  import { queryClient, type QueryResult } from '$lib/query/config';
  import { getContext } from 'svelte';
  import {
    ERC20_ALLOWANCE_CTX,
    ERC20_BALANCE_CTX,
    ERC20_CONTRACT_CTX,
    ERC20_DATA_CTX,
    SUBSCRIPTION_CONTRACT_CTX,
    SUBSCRIPTION_DATA_CTX
  } from '../+layout.svelte';
  import { currentAccount } from '$lib/web3/onboard';
  import type { Hash } from '$lib/web3/contracts/common';
  import { ALLOWANCE, ERC20 } from '$lib/query/keys';

  export let data: PageData;

  const addr = data.subscriptionAddr;

  const onMinted = async (ev: CustomEvent<[bigint, string]>) => {
    const [id, hash] = ev.detail;
    toast.info(`New Subscription minted: ${id} in ${hash}`);
    // TODO FIXME
    goto($page.url.pathname + '../' + id);
  };

  const subscriptionContract =
    getContext<QueryResult<SubscriptionContainer>>(SUBSCRIPTION_CONTRACT_CTX);

  const subscriptionData = getContext<QueryResult<SubscriptionContractData>>(SUBSCRIPTION_DATA_CTX);

  const erc20Contract = getContext<QueryResult<Erc20Container>>(ERC20_CONTRACT_CTX);
  const erc20Data = getContext<QueryResult<Erc20Data>>(ERC20_DATA_CTX);

  const erc20Allowance = getContext<QueryResult<bigint>>(ERC20_ALLOWANCE_CTX);
  const erc20Balance = getContext<QueryResult<bigint>>(ERC20_BALANCE_CTX);

  const approved = ({ detail: [amount, hash] }: CustomEvent<[bigint, Hash]>) => {
    queryClient.invalidateQueries({ queryKey: [ERC20, ALLOWANCE] });
    toast.info(`Amount of ${amount} approved in tx ${hash}`);
  };
</script>

<h1>Mint new Subscription Token</h1>

{#if $erc20Contract.isSuccess && $erc20Balance.isSuccess && $erc20Allowance.isSuccess && $subscriptionContract.isSuccess && $currentAccount}
  <MintSubscriptionForm
    allowance={$erc20Allowance.data}
    balance={$erc20Balance.data}
    mint={mint($subscriptionContract.data.contract, $currentAccount)}
    approve={approveFunc($erc20Contract.data.contract, addr)}
    on:minted={onMinted}
    on:approved={approved}
    on:mintTxSubmitted={(ev) => toast.info(`Mint Transaction submitted: ${ev.detail}`)}
    on:approvalTxSubmitted={(ev) => toast.info(`Approval Transaction submitted: ${ev.detail}`)}
    on:txFailed={(ev) => toast.error(`Transaction failed: ${ev.detail}`)}
  ></MintSubscriptionForm>
{/if}
