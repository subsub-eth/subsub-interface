<script lang="ts">
  import { type WarningMessage } from '$lib/web3/contracts/subscription-analytics';
  import { cn } from '$lib/utils';
  import { AlertTriangle, ChevronsDownUp, ChevronsUpDown } from 'lucide-svelte';
  import * as Tooltip from '$lib/components/ui/tooltip';

  /** warning messages to be displayed */
  export let messages: Array<WarningMessage> | undefined;

  let clazz: string = 'h-8 w-8';
  export { clazz as class };

  const colorError = 'stroke-red-500';
  const colorWarning = 'stroke-yellow-500';
  const colorPaused = 'stroke-yellow-500';

  const msgs = messages ?? [];
  const errors = msgs?.filter((msg) => msg.type === 'error').length;
  const warnings = msgs?.filter((msg) => msg.type === 'warning').length;
  const paused = msgs?.filter((msg) => msg.type === 'paused').length;
</script>

{#if messages && messages.length > 0}
  <Tooltip.Root>
    <Tooltip.Trigger class="flex justify-end text-white">
      {#if errors}
        <AlertTriangle class={cn(colorError, clazz)} />
      {/if}
      {#if warnings}
        <AlertTriangle class={cn(colorWarning, clazz)} />
      {/if}
      {#if paused}
        <AlertTriangle class={cn(colorPaused, clazz)} />
      {/if}
    </Tooltip.Trigger>
    <Tooltip.Content>There are {messages.length} issues with this subscription plan</Tooltip.Content>
  </Tooltip.Root>
{/if}
