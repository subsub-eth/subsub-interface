<script lang="ts">
  import Wallet from './Wallet.svelte';
  import ChainSelector from './ChainSelector.svelte';

  import { currentChains } from '$lib/chain-config';
  import { goto } from '$app/navigation';
  import { chainEnvironment } from './chain-context';

  let availableChains: Array<{ chainId: number; name: string; label: string }> = currentChains.map(
    ([name, chainData]) => {
      return { chainId: chainData.chainId, name: name, label: chainData.displayName };
    }
  );

  let onChainChange = async (chainId: number) => {
    const chainName = availableChains.filter((c) => c.chainId === chainId).map((c) => c.name)[0];
    return goto('/' + chainName);
  };
</script>

<div class="flex flex-row gap-4">
  {#if $chainEnvironment}
    <ChainSelector
      currentChainId={$chainEnvironment.chainData.chainId}
      {availableChains}
      onchange={onChainChange}
    />
    <Wallet />
  {/if}
</div>
