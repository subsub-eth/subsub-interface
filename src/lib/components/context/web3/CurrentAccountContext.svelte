<script lang="ts">
  import { currentAccount } from '$lib/web3/onboard';
</script>

{#if $currentAccount}
  {@const acc = $currentAccount}
  <slot currentAccount={acc} />
{/if}
