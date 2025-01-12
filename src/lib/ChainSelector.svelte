<script lang="ts">
  import * as Select from '$lib/components/ui/select/index.js';

  interface Props {
    currentChainId: number;
    availableChains: Array<{ chainId: number; name: string; label: string }>;
    onchange: (chainId: number) => Promise<void>;
  }

  let { currentChainId, availableChains, onchange }: Props = $props();

  let value = $state(
    availableChains.filter((c) => c.chainId === currentChainId).map((c) => c.name)[0]
  );

  let selectedChain = $derived(availableChains.find((c) => c.chainId === currentChainId));
  $inspect(value);
</script>

{#if availableChains.length < 2}
  <div>{selectedChain?.label}</div>
{:else}
  <Select.Root type="single" name="chain" bind:value>
    <Select.Trigger class="border-primary bg-inherit">
      {selectedChain?.label}
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        {#each availableChains as chain}
          <!-- {#if chain.chainId !== currentChainId} -->
            <Select.Item
              value={chain.name}
              label={chain.label}
              onclick={() => onchange(chain.chainId)}>{chain.label}</Select.Item
            >
          <!-- {/if} -->
        {/each}
      </Select.Group>
    </Select.Content>
  </Select.Root>
{/if}
