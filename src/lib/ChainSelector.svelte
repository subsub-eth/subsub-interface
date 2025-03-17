<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { ChevronDown } from 'lucide-svelte';

  interface Props {
    currentChainId: number;
    availableChains: Array<{ chainId: number; name: string; label: string }>;
    onchange: (chainId: number) => Promise<void>;
  }

  let { currentChainId, availableChains, onchange }: Props = $props();

  let selectedChain = $derived(availableChains.find((c) => c.chainId === currentChainId));
</script>

{#if availableChains.length < 2}
  <div>{selectedChain?.label}</div>
{:else}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger class="flex items-center gap-2"
      >{selectedChain?.label} <ChevronDown class="h-4 w-4" /></DropdownMenu.Trigger
    >
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        {#each availableChains as chain (chain.chainId)}
          <DropdownMenu.Item
            onclick={() => currentChainId != chain.chainId && onchange(chain.chainId)}
            >{chain.label}</DropdownMenu.Item
          >
        {/each}
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
{/if}
