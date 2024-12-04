<script lang="ts">
  import { type WarningMessage } from '$lib/web3/contracts/subscription-analytics';
  import { cn } from '$lib/utils';
  import { AlertTriangle, ChevronsDownUp, ChevronsUpDown } from 'lucide-svelte';
  import * as Collapsible from '$lib/components/ui/collapsible';

  interface Props {
    /** warning messages to be displayed */
    messages: Array<WarningMessage> | undefined;
    /** Collapsible is opened */
    open?: boolean;
    class?: string;
  }

  let { messages, open = $bindable(false), class: clazz = 'h-8 w-8' }: Props = $props();

  const colorError = 'stroke-red-500';
  const colorWarning = 'stroke-yellow-500';
  const colorPaused = 'stroke-yellow-500';

  let msgs = $derived(messages ?? []);
  let errors = $derived(msgs?.filter((msg) => msg.type === 'error'));
  let warnings = $derived(msgs?.filter((msg) => msg.type === 'warning'));
  let paused = $derived(msgs?.filter((msg) => msg.type === 'paused'));
</script>

{#if messages && messages.length > 0}
  <Collapsible.Root bind:open>
    <div class="flex justify-end text-white">
      <Collapsible.Trigger class="flex gap-4">
        {#if errors.length}
          <div>
            <AlertTriangle class={cn(colorError, clazz)} />
            {#if errors.length > 1}
              {errors.length}x
            {/if}
          </div>
        {/if}
        {#if warnings.length}
          <div>
            <AlertTriangle class={cn(colorWarning, clazz)} />
            {#if warnings.length > 1}
              {warnings.length}x
            {/if}
          </div>
        {/if}
        {#if paused.length}
          <div>
            <AlertTriangle class={cn(colorPaused, clazz)} />
            {#if paused.length > 1}
              {paused.length}x
            {/if}
          </div>
        {/if}
        {#if open}
          <ChevronsDownUp className="h-4 w-4 flex-none" />
        {:else}
          <ChevronsUpDown className="h-4 w-4 flex-none" />
        {/if}
      </Collapsible.Trigger>
    </div>
    {#if errors.length}
      <ul class="list-outside list-disc border border-red-500 p-4 pl-8 text-white">
        {#each errors as error}
          <li>
            {error.text}
          </li>
        {/each}
      </ul>
    {/if}
    <Collapsible.Content>
      {#each [warnings, paused] as msgs}
        {#if msgs.length}
          <ul class="list-outside list-disc border border-yellow-500 p-4 pl-8 text-white">
            {#each msgs as msg}
              <li>
                {msg.text}
              </li>
            {/each}
          </ul>
        {/if}
      {/each}
    </Collapsible.Content>
  </Collapsible.Root>
{/if}
