<script lang="ts">
  import { PROFILE_CONTRACT, requireContext } from '$lib/contexts';
  import type { Profile } from '@createz/contracts/types/ethers-contracts';
  import type { Readable } from 'svelte/store';

  const profile = requireContext<Readable<Profile>>(PROFILE_CONTRACT);
</script>

{#if $profile}
  {@const profileContract = $profile}
  <slot {profileContract} />
{/if}
