<script lang="ts">
  import Wallet from '../Wallet.svelte';
  import { isAccountConnected } from '$lib/web3/onboard';

  $: console.debug(`isAccountConnected in component`, $isAccountConnected);
  $: console.debug(`value of isAccountConnected$ in component`, isAccountConnected);
</script>

{#if $isAccountConnected}
  <slot />
{:else}

  <div>please connect</div>
  <Wallet />
{/if}
