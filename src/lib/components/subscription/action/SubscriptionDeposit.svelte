<script lang="ts">
  import {
    ERC20__factory,
    type ERC20,
    type Subscription
  } from '@createz/contracts/types/ethers-contracts';
  import { ethersSigner, findLog, getReceipt } from '$lib/web3/ethers';
  import { type Signer } from 'ethers';
  import DepositForm from './deposit/DepositForm.svelte';
  import { approveFunc, type DepositDispatch, type DepositSubscriptionEvents } from './subscription-events';
  import { waitFor } from '$lib/helpers';
    import { createEventDispatcher } from 'svelte';

  export let subContract: Subscription;
  export let subscriptionId: bigint;
  export let currentAccount: string;

  let token: ERC20;
  let allowance: bigint;
  let balance: bigint;
  let subscriptionAddress: string;

  const dispatch = createEventDispatcher<DepositSubscriptionEvents>();

  const loadTokenData = async (
    subContract: Subscription,
    etherSigner: Signer,
    currentAccount: string
  ): Promise<void> => {
    console.log('load token address', await subContract.getAddress());
    const [tokenAddr] = await subContract.settings();
    token = ERC20__factory.connect(tokenAddr, etherSigner);
    allowance = await token.allowance(currentAccount, subContract.getAddress());
    balance = await token.balanceOf(currentAccount);
    subscriptionAddress = await subContract.getAddress();

    // TODO remove
    await waitFor(2000);
  };

  $: renew = async (
    amount: bigint,
    message: string,
    dispatch: DepositDispatch
  ): Promise<[bigint, string]> => {
    const tx = await subContract.renew(subscriptionId, amount, message);
    dispatch('depositTxSubmitted', tx.hash);
    const receipt = await getReceipt(tx);
    dispatch('deposited', [amount, receipt.hash]);

    return [amount, message];
  };
</script>

<div>
  {#if $ethersSigner}
    {#await loadTokenData(subContract, $ethersSigner, currentAccount)}
      Loading...
    {:then _}
      <DepositForm
        {allowance}
        {balance}
        submitLabel="Renew"
        approve={approveFunc(token, subscriptionAddress)}
        deposit={renew}
        on:approved={(ev) => {
          // TODO toast
          const [amount, hash] = ev.detail;
          allowance = amount;
          dispatch('approved', ev.detail);
        }}
        on:deposited
        on:txFailed
        on:depositTxSubmitted
        on:approvalTxSubmitted
      />
    {/await}
  {/if}
</div>
