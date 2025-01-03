<script lang="ts">
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import MintSubscriptionForm from '$lib/components/subscription/action/MintSubscriptionForm.svelte';
  import { mint, type WritableSubscription } from '$lib/web3/contracts/subscription';
  import { approveFunc, type WritableErc20 } from '$lib/web3/contracts/erc20';
  import toast from '$lib/toast';
  import { queryClient, type QueryResult } from '$lib/query/config';
  import { getContext } from 'svelte';
  import {
    ERC20_ALLOWANCE_CTX,
    ERC20_BALANCE_CTX,
    WRITABLE_ERC20_CONTRACT_CTX,
    WRITABLE_SUBSCRIPTION_CONTRACT_CTX
  } from '../+layout.svelte';
  import { currentAccount } from '$lib/web3/onboard';
  import type { Hash } from '$lib/web3/contracts/common';
  import { erc20Keys } from '$lib/query/keys';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const addr = data.subscriptionAddr;

  const onMinted = (id: bigint, tx: Hash) => {
    toast.info(`New Subscription minted: ${id} in ${tx}`);
    // TODO FIXME
    goto(page.url.pathname + '../' + id);
  };

  const subscriptionContract = getContext<QueryResult<WritableSubscription>>(
    WRITABLE_SUBSCRIPTION_CONTRACT_CTX
  );

  const erc20Contract = getContext<QueryResult<WritableErc20>>(WRITABLE_ERC20_CONTRACT_CTX);

  const erc20Allowance = getContext<QueryResult<bigint>>(ERC20_ALLOWANCE_CTX);
  const erc20Balance = getContext<QueryResult<bigint>>(ERC20_BALANCE_CTX);

  const approved = (amount: bigint, tx: Hash) => {
    queryClient.invalidateQueries({
      queryKey: erc20Keys.allowance(
        $erc20Contract!.data!.address,
        $currentAccount!,
        $subscriptionContract!.data!.address
      )
    });
    toast.info(`Amount of ${amount} approved in tx ${tx}`);
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
    {onMinted}
    onApproved={approved}
    onMintTxSubmitted={(tx) => toast.info(`Mint Transaction submitted: ${tx}`)}
    onApprovalTxSubmitted={(tx) => toast.info(`Approval Transaction submitted: ${tx}`)}
    onTxFailed={(tx) => toast.error(`Transaction failed: ${tx}`)}
  ></MintSubscriptionForm>
{/if}
