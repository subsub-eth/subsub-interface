<script lang="ts">
  import ProfileTeaser from '$lib/components/profile/ProfileTeaser.svelte';
  import type { Address } from '$lib/web3/contracts/common';
  import type { ProfileData } from '$lib/web3/contracts/profile';

  interface Props {
    owner: Address | ProfileData;
  }

  let { owner }: Props = $props();
</script>

{#if typeof owner === 'string'}
  <div class="rounded-xl border-2 border-solid p-2">
    owner: {owner}
  </div>
{:else}
  <ProfileTeaser profile={owner} />
{/if}
