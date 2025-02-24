<script lang="ts">
  import Wallet from './Wallet.svelte';
  import ChainSelector from './ChainSelector.svelte';

  import { currentChains, getChainDisplayName, getChainId } from '$lib/chain-config';
  import { goto } from '$app/navigation';
  import { chainEnvironment } from './chain-context';

  let availableChains: Array<{ chainId: number; name: string; label: string }> = currentChains
    .map(([name, chainData]) => {
      return { chainId: getChainId(chainData), name: name, label: getChainDisplayName(chainData) };
    })
    .filter(({ chainId }) => chainId !== undefined)
    .map(({ chainId, name, label }) => ({ chainId: chainId!, name, label }));

  let onChainChange = async (chainId: number) => {
    const chainName = availableChains.filter((c) => c.chainId === chainId).map((c) => c.name)[0];
    return goto('/' + chainName);
  };
</script>

<div class="flex flex-row gap-4">
  {#if $chainEnvironment}
    <ChainSelector
      currentChainId={getChainId($chainEnvironment.chainData)!}
      {availableChains}
      onchange={onChainChange}
    />
    <Wallet />
  {/if}
</div>
