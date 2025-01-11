<script lang="ts">
  import Button from '../Button.svelte';
  import * as Card from '$lib/components/ui/card';
  import type { SubscriptionContractData, ClaimFunc } from '$lib/web3/contracts/subscription';
  import type { ClaimSubscriptionContractEvents } from './action/subscription-events';
  import { createMutation } from '@tanstack/svelte-query';
  import type { Address } from '$lib/web3/contracts/common';
  import DetailsProperty from '../ui/DetailsProperty.svelte';

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

<Card.Root>
  <Card.Title class="p-6 pb-0 pt-4 text-lg font-bold">Earnings</Card.Title>
  <Card.Content>
    <div>
      <DetailsProperty title="Current Epoch" value={`${data.currentEpoch}`} />
      <DetailsProperty title="Last processed Epoch" value={`${data.lastProcessedEpoch}`} />
      <DetailsProperty title="Next Epoch starts at" value={`${epochEnd}`} />
      <DetailsProperty title="Claimable Funds" value={`${data.claimable}`} />
      <DetailsProperty title="Claimed Deposits" value={`${data.depositsClaimed}`} />
      <DetailsProperty title="Claimed Tips" value={``} />
      <DetailsProperty title="" value={`${data.tipsClaimed}`} />
    </div>
  </Card.Content>
  <Card.Footer class="flex flex-col items-start gap-4">
    <Button loading={$claimMutation.isPending} onclick={doClaim} disabled={data.claimable === 0n}
      >Claim Funds</Button
    >
    <p class="text-xs">Only funds of completed epochs are claimable</p>
  </Card.Footer>
</Card.Root>
