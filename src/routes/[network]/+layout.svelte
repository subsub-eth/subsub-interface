<script lang="ts">
  import { chainEnvironment } from '$lib/chain-context';
  import { isAccountConnected } from '$lib/web3/onboard';

  // TODO distinguish provider and signer
</script>

{#if $isAccountConnected && $chainEnvironment}
  <slot />
{:else}
  <div>please connect</div>
{/if}
