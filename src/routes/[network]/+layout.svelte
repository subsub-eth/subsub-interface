<script lang="ts">
    import { getChain } from '$lib/chain-config';
  import { currentChainId, isAccountConnected } from '$lib/web3/onboard';

  // $: matchingChain = getChain($currentChainId ? $currentChainId : 0) === 

</script>

{#if $isAccountConnected}
  <slot />
{:else}
  <div>please connect</div>
{/if}
