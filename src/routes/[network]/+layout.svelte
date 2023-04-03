<script lang="ts">
  import Wallet from '../Wallet.svelte';
  import { isAccountConnected$ } from '$lib/web3/onboard';

  $: isAccountConnected = $isAccountConnected$;
</script>

{#if isAccountConnected}
  <slot />
{:else}
  <div>please connect</div>
  <Wallet />
{/if}
