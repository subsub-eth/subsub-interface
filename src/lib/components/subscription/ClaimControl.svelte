<script lang="ts">
  import Button from '../Button.svelte';
  import type { SubscriptionContractData, ClaimFunc } from '$lib/web3/contracts/subscription';
  import type { ClaimSubscriptionContractEvents } from './action/subscription-events';
  import { createMutation } from '@tanstack/svelte-query';
  import type { Address } from '$lib/web3/contracts/common';

  interface Props extends ClaimSubscriptionContractEvents {
    data: SubscriptionContractData;
    claimTo: Address;
    claim: ClaimFunc;
  }

  let { data, claimTo, claim, onTxFailed, onClaimTxSubmitted, onClaimed }: Props = $props();

  const claimMutation = createMutation({
    mutationFn: async ([address]: Parameters<typeof claim>) =>
      claim(address, {
        onClaimTxSubmitted: (hash) => onClaimTxSubmitted?.(hash)
      }),
    onError: (error) => onTxFailed?.(error),
    onSuccess: ([amount, hash]) => {
      onClaimed?.(amount, hash);
    }
  });

  const doClaim = async () => {
    return await $claimMutation.mutateAsync([claimTo]);
  };

  const epochEnd = new Date(
    data.epochSize * (Number(data.currentEpoch) + 1) * 1000
  ).toLocaleString();
</script>

<div>
  <div>
    <p>Only funds of completed epochs are claimable</p>

    Current Epoch: {data.currentEpoch}<br />
    Last processed Epoch: {data.lastProcessedEpoch}<br />
    Next Epoch starts at: {epochEnd}<br />
    Claimable Funds: {data.claimable}<br />
    Claimed Deposits: {data.depositsClaimed}<br />
    Claimed Tips: {data.tipsClaimed}<br />
  </div>
  <Button
    loading={$claimMutation.isPending}
    onclick={doClaim}
    disabled={data.claimable === 0n}
  >Claim</Button>
</div>
