<script lang="ts">
  import {
    ERC20__factory,
    type ERC20,
    type Subscription
  } from '@createz/contracts/types/ethers-contracts';
  import { ethersSigner } from '$lib/web3/ethers';
  import MintSubscriptionForm from './MintSubscriptionForm.svelte';
  import type { Signer } from 'ethers';

  export let subContract: Subscription;
  export let currentAccount: string;

  const getTokenData = async (
    subContract: Subscription,
    etherSigner: Signer
  ): Promise<[ERC20, bigint, bigint]> => {
    console.log('load token address', await subContract.getAddress());
    const [tokenAddr] = await subContract.settings();
    const token = ERC20__factory.connect(tokenAddr, etherSigner);
    const allowance = await token.allowance(currentAccount, subContract.getAddress());
    const balance = await token.balanceOf(currentAccount);
    return [token, allowance, balance];
  };
</script>

<div>
  {#if $ethersSigner}
    {#await getTokenData(subContract, $ethersSigner)}
      Loading...
    {:then [token, allowance, balance]}
      <MintSubscriptionForm
        {subContract}
        {currentAccount}
        {allowance}
        {token}
        {balance}
        on:minted
        on:approved
        on:txFailed
        on:mintTxSubmitted
        on:approvalTxSubmitted
      />
    {/await}
  {/if}
</div>
