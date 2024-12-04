<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { HelpCircle } from 'lucide-svelte';
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';

  interface Props {
    /** Title of the property */
    title: string;
    /** Property value */
    value?: string | Snippet;
    /** Help text */
    help?: string;

    /**
     * Additional css classes
     */
    class?: string;
  }

  let { title, value, help, class: clazz = '' }: Props = $props();

  const defaultClasses = 'flex items-center justify-between pt-2';
  let classes = cn(defaultClasses, clazz);
</script>

<div class={classes}>
  <div class="flex items-center gap-2">
    <span>{title}</span>
    {#if help}
      <Tooltip.Root>
        <Tooltip.Trigger>
          <HelpCircle class="h-4 w-4 flex-none" />
        </Tooltip.Trigger>
        <Tooltip.Content>
          {help}
        </Tooltip.Content>
      </Tooltip.Root>
    {/if}
  </div>
  <div>
    {#if value}
      {#if typeof value == 'string'}
        <div class="">{value}</div>
      {:else}
        {@render value()}
      {/if}
    {/if}
  </div>
</div>
