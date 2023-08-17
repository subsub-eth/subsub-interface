<script lang="ts">
  import { Subscription__factory } from '@createz/contracts/types/ethers-contracts';
  import type { Signer } from 'ethers';

  export let address: string;
  export let ethersSigner: Signer;

  $: subscriptionContract = Subscription__factory.connect(address, ethersSigner);
</script>

{#if subscriptionContract}
  <slot {subscriptionContract} />
{/if}
