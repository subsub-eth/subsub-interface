<script lang="ts">
  import { SUBSCRIPTION_MANAGER_CONTRACT, requireContext } from '$lib/contexts';
  import type { ISubscriptionManager } from '@createz/contracts/types/ethers-contracts';
  import type { Readable } from 'svelte/store';

  const manager = requireContext<Readable<ISubscriptionManager>>(SUBSCRIPTION_MANAGER_CONTRACT);
</script>

{#if $manager}
  {@const managerContract = $manager}
  <slot {managerContract} />
{/if}
