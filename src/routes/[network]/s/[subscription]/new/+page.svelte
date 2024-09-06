<script lang="ts">
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import MintSubscriptionForm from '$lib/components/subscription/action/MintSubscriptionForm.svelte';
  import {
    mint,
    type Subscription,
    type SubscriptionContractData,

    type WritableSubscription

  } from '$lib/web3/contracts/subscription';
  import { approveFunc, type Erc20, type Erc20Data, type WritableErc20 } from '$lib/web3/contracts/erc20';
  import toast from '$lib/toast';
  import { queryClient, type QueryResult } from '$lib/query/config';
  import { getContext } from 'svelte';
  import {
    ERC20_ALLOWANCE_CTX,
    ERC20_BALANCE_CTX,
    ERC20_CONTRACT_CTX,
    ERC20_DATA_CTX,
    SUBSCRIPTION_CONTRACT_CTX,
    SUBSCRIPTION_DATA_CTX,

    WRITABLE_ERC20_CONTRACT_CTX,

    WRITABLE_SUBSCRIPTION_CONTRACT_CTX

  } from '../+layout.svelte';
  import { currentAccount } from '$lib/web3/onboard';
  import type { Hash } from '$lib/web3/contracts/common';
  import { erc20Keys } from '$lib/query/keys';

  export let data: PageData;

  const addr = data.subscriptionAddr;

  const onMinted = async (ev: CustomEvent<[bigint, string]>) => {
    const [id, hash] = ev.detail;
    toast.info(`New Subscription minted: ${id} in ${hash}`);
    // TODO FIXME
    goto($page.url.pathname + '../' + id);
  };

  const subscriptionContract =
    getContext<QueryResult<WritableSubscription>>(WRITABLE_SUBSCRIPTION_CONTRACT_CTX);

  const subscriptionData = getContext<QueryResult<SubscriptionContractData>>(SUBSCRIPTION_DATA_CTX);

  const erc20Contract = getContext<QueryResult<WritableErc20>>(WRITABLE_ERC20_CONTRACT_CTX);
  const erc20Data = getContext<QueryResult<Erc20Data>>(ERC20_DATA_CTX);

  const erc20Allowance = getContext<QueryResult<bigint>>(ERC20_ALLOWANCE_CTX);
  const erc20Balance = getContext<QueryResult<bigint>>(ERC20_BALANCE_CTX);

  const approved = ({ detail: [amount, hash] }: CustomEvent<[bigint, Hash]>) => {
    queryClient.invalidateQueries({
      queryKey: erc20Keys.allowance(
        $erc20Contract!.data!.address,
        $currentAccount!,
        $subscriptionContract!.data!.address
      )
    });
    toast.info(`Amount of ${amount} approved in tx ${hash}`);
  };
</script>

<h1>Mint new Subscription Token</h1>

{#if $erc20Contract.isSuccess && $erc20Balance.isSuccess && $erc20Allowance.isSuccess && $subscriptionContract.isSuccess && $currentAccount}
  <MintSubscriptionForm
    formId={addr}
    allowance={$erc20Allowance.data}
    balance={$erc20Balance.data}
    mint={mint($subscriptionContract.data, $currentAccount)}
    approve={approveFunc($erc20Contract.data, addr)}
    on:minted={onMinted}
    on:approved={approved}
    on:mintTxSubmitted={(ev) => toast.info(`Mint Transaction submitted: ${ev.detail}`)}
    on:approvalTxSubmitted={(ev) => toast.info(`Approval Transaction submitted: ${ev.detail}`)}
    on:txFailed={(ev) => toast.error(`Transaction failed: ${ev.detail}`)}
  ></MintSubscriptionForm>
{/if}
