<script lang="ts">
  import HeaderWallet from '$lib/HeaderWallet.svelte';
  import { chainEnvironment } from '$lib/chain-context';
  import Button from '$lib/components/Button.svelte';
  import { currentChainId } from '$lib/web3/onboard';
  import { publicClient, walletClient } from '$lib/web3/viem';
  import NavigationHeader from '../NavigationHeader.svelte';

  import toast from '$lib/toast';
  import { log } from '$lib/logger';
  import { getChainDisplayName, getChainId } from '$lib/chain-config';

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

<div class="grid grid-cols-1 justify-items-center gap-4">
  {#if $publicClient && $chainEnvironment}
    {#if !$walletClient || $currentChainId === getChainId($chainEnvironment.chainData)}
      {@render children?.()}
    {:else}
      <p>Please switch to the connected network in your wallet</p>
      <Button
        onclick={() =>
          switchChain({
            chainId: getChainId($chainEnvironment.chainData),
            name: getChainDisplayName($chainEnvironment.chainData)
          })}>Switch to {getChainDisplayName($chainEnvironment.chainData)}</Button
      >
    {/if}
  {:else}
    <p>Please connect your wallet</p>
  {/if}
</div>
