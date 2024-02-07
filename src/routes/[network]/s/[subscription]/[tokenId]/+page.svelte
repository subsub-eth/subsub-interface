<script lang="ts">
  import SubscriptionDetails from '$lib/components/subscription/SubscriptionDetails.svelte';
  import type { PageData } from './$types';
  import SubscriptionDeposit from '$lib/components/subscription/action/SubscriptionDeposit.svelte';
  import SubscriptionWithdrawal from '$lib/components/subscription/action/SubscriptionWithdrawal.svelte';
  import {
    cancel,
    renew,
    withdraw,
    tip,
    createSubscriptionContract,
    type SubscriptionContractData,
    getContractData,
    type SubscriptionData,
    getSubscriptionData,
    type SubscriptionContainer
  } from '$lib/web3/contracts/subscription';
  import { approveFunc } from '$lib/web3/contracts/erc20';
  import { createQuery } from '@tanstack/svelte-query';
  import { chainEnvironment } from '$lib/chain-context';
  import { derived } from 'svelte/store';
  import { log } from '$lib/logger';

  export let data: PageData;

  const addr = data.subscriptionAddr;
  const tokenId = data.tokenId;

  const subscriptionContract = createQuery<SubscriptionContainer>(
    derived(chainEnvironment, (chainEnvironment) => ({
      queryKey: ['subscription', addr],
      queryFn: () => createSubscriptionContract(addr, chainEnvironment!.ethersSigner)
    }))
  );

  const subscriptionContractData = createQuery<SubscriptionContractData>(
    derived(subscriptionContract, (subscriptionContract) => ({
      queryKey: ['subContractMetadata', addr],
      queryFn: async () => {
        log.debug('query for sub contract metadata', addr, subscriptionContract);
        const data = await getContractData(subscriptionContract.data!.contract);
        log.debug('sub contract metadata', data);
        return data;
      },
      enabled: subscriptionContract.isSuccess
    }))
  );

  const subscriptionData = createQuery<SubscriptionData>(
    derived(subscriptionContract, (subscriptionContract) => ({
      queryKey: ['subscriptionData', addr, tokenId.toString()],
      queryFn: async () => {
        log.debug('Loading sub data', addr, tokenId);
        const data = await getSubscriptionData(subscriptionContract.data!.contract, tokenId);
        return data;
      },
      enabled: subscriptionContract.isSuccess
    }))
  );

  const updateTokenMetadata = async () => {};
</script>

<h1>Subscription Details</h1>

<div>
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
      <SubscriptionDetails subscriptionData={$subscriptionData.data} />
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
    <!-- <CurrentAccountContext let:currentAccount> -->
    <!--   <ERC20Context address={contractMetadata.token} {ethersSigner} let:token> -->
    <!--     <ERC20BalanceContext -->
    <!--       {token} -->
    <!--       account={currentAccount} -->
    <!--       let:balance -->
    <!--       let:update={updateBalance} -->
    <!--     > -->
    <!--       <ERC20AllowanceContext -->
    <!--         {token} -->
    <!--         account={currentAccount} -->
    <!--         spender={addr} -->
    <!--         let:allowance -->
    <!--         let:update={updateAllowance} -->
    <!--       > -->
    <!--         {@const doUpdate = async () => -->
    <!--           await Promise.all([updateBalance(), updateAllowance(), updateTokenMetadata()]).then( -->
    <!--             () => {} -->
    <!--           )} -->
    <!--         <SubscriptionDeposit -->
    <!--           {allowance} -->
    <!--           {balance} -->
    <!--           approve={approveFunc(token, addr)} -->
    <!--           renew={renew(subscriptionContract, tokenId)} -->
    <!--           tip={tip(subscriptionContract, tokenId)} -->
    <!--           updateData={doUpdate} -->
    <!--         /> -->
    <!--         {@const withdrawable = BigInt( -->
    <!--           tokenMetadata.attributes?.find((e) => e.trait_type === 'withdrawable')?.value -->
    <!--         )} -->
    <!--         {@const deposited = BigInt( -->
    <!--           tokenMetadata.attributes?.find((e) => e.trait_type === 'deposited')?.value -->
    <!--         )} -->
    <!--         <!-- TODO: disable when not owner -->
    <!--         <SubscriptionWithdrawal -->
    <!--           withdraw={withdraw(subscriptionContract, tokenId)} -->
    <!--           cancel={cancel(subscriptionContract, tokenId)} -->
    <!--           {withdrawable} -->
    <!--           {deposited} -->
    <!--           updateData={doUpdate} -->
    <!--         /> -->
    <!--       </ERC20AllowanceContext> -->
    <!--     </ERC20BalanceContext> -->
    <!--   </ERC20Context> -->
    <!-- </CurrentAccountContext> -->
  </div>
</div>
