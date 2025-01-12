<script lang="ts">
  import HeaderWallet from '$lib/HeaderWallet.svelte';
  import { chainEnvironment } from '$lib/chain-context';
  import Button from '$lib/components/Button.svelte';
  import { currentChainId, isAccountConnected } from '$lib/web3/onboard';
  import { walletClient } from '$lib/web3/viem';
  import NavigationHeader from '../NavigationHeader.svelte';

  import toast from '$lib/toast';
  import { log } from '$lib/logger';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  let switchChain = async ({ chainId, name }: { chainId: number; name: string }) => {
    try {
      await $walletClient?.switchChain({ id: chainId });
      toast.success(`Switched network to ${name}!`);
    } catch (err) {
      toast.error(`Unable to switch to chain ${name}`);
      log.error('failed to switch to chain', chainId, name, err);
    }
  };

  // TODO distinguish provider and signer
</script>

<NavigationHeader>
  <HeaderWallet />
</NavigationHeader>

<div class="grid grid-cols-1 gap-4 justify-items-center">
  {#if $isAccountConnected && $chainEnvironment}
    {#if $currentChainId === $chainEnvironment.chainData.chainId}
      {@render children?.()}
    {:else}
      <p>Please switch to the connected network in your wallet</p>
      <Button
        onclick={() =>
          switchChain({
            chainId: $chainEnvironment.chainData.chainId,
            name: $chainEnvironment.chainData.displayName
          })}>Switch to {$chainEnvironment.chainData.displayName}</Button
      >
    {/if}
  {:else}
    <p>Please connect your wallet</p>
  {/if}
</div>
