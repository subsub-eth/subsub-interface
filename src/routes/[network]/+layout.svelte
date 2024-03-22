<script lang="ts">
  import HeaderWallet from '$lib/HeaderWallet.svelte';
  import { chainEnvironment } from '$lib/chain-context';
  import { isAccountConnected } from '$lib/web3/onboard';
  import NavigationHeader from '../NavigationHeader.svelte';

  // TODO distinguish provider and signer
</script>

<NavigationHeader>
  <HeaderWallet />
</NavigationHeader>

{#if $isAccountConnected && $chainEnvironment}
  <slot />
{:else}
  <div>please connect</div>
{/if}
