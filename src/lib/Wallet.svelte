<script lang="ts">
  import onboard, { currentAccount, isAccountConnected, primaryWallet } from '$lib/web3/onboard';
  import Button from '$lib/components/Button.svelte';
  import { truncateAddress } from './helpers';

  const connect = async () => {
    await onboard.connectWallet();
  };

  const disconnect = async () => {
    await onboard.disconnectWallet({ label: $primaryWallet?.label + '' });
  };
</script>

{#if $isAccountConnected}
  <Button onclick={disconnect}>
    {truncateAddress($currentAccount + '')}
  </Button>
{:else}
  <Button onclick={connect}>Connect Wallet</Button>
{/if}

<style>
</style>
