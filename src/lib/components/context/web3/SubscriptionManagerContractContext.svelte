<script lang="ts">
  import { SUBSCRIPTION_HANDLE_CONTRACT, requireContext } from '$lib/contexts';
  import type { ISubscriptionHandle } from '@createz/contracts/types/ethers-contracts';
  import type { Readable } from 'svelte/store';

  const manager = requireContext<Readable<ISubscriptionHandle>>(SUBSCRIPTION_HANDLE_CONTRACT);
</script>

{#if $manager}
  {@const managerContract = $manager}
  <slot {managerContract} />
{/if}
