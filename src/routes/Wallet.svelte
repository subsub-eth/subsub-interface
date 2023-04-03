<script lang="ts">
  import onboard, {wallets$, isAccountConnected$} from '$lib/web3/onboard';

  $: accountConnected = $isAccountConnected$;
  $: connectedAccount = $wallets$?.[0]?.accounts?.[0];
  const connect = async () => {
    await onboard.connectWallet();
  };

  const disconnect = async () => {
      const [primaryWallet] = $wallets$;
      await onboard.disconnectWallet({ label: primaryWallet?.label} );
    }
</script>

accountConnected: '{accountConnected}'
{#if accountConnected}
  <button on:click={disconnect}>Disconnect Wallet</button>
{:else }
  <button on:click={connect}>Connect Wallet</button>
{/if}

<style>
</style>
