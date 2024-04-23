<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from '../Button.svelte';
  import type { SubscriptionContractData, ClaimFunc } from '$lib/web3/contracts/subscription';
  import type { ClaimSubscriptionContractEvents } from './action/subscription-events';
  import { createMutation } from '@tanstack/svelte-query';
  import type { Address } from '$lib/web3/contracts/common';

  export let data: SubscriptionContractData;
  export let claimTo: Address;
  export let claim: ClaimFunc;

  const dispatch = createEventDispatcher<ClaimSubscriptionContractEvents>();

  const claimMutation = createMutation({
    mutationFn: async ([address]: Parameters<typeof claim>) =>
      claim(address, {
        onClaimTxSubmitted: (hash) => dispatch('claimTxSubmitted', hash)
      }),
    onError: (error) => dispatch('txFailed', error),
    onSuccess: ([amount, hash]) => {
      dispatch('claimed', [amount, hash]);
    }
  });

  const doClaim = async () => {
    return await $claimMutation.mutateAsync([claimTo]);
  };
</script>

<div>
  <div>
    <p>Only funds of completed epochs are claimable</p>
    Claimable Funds: {data.claimable}
    Claimed Deposits: {data.depositsClaimed}
    Claimed Tips: {data.tipsClaimed}
  </div>
  <Button
    label="Claim"
    isLoading={$claimMutation.isPending}
    on:click={doClaim}
    isDisabled={data.claimable === 0n}
  />
</div>
