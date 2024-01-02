<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { HelpCircle } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  /** Title of the property */
  export let title: string;
  /** Property value */
  export let value: string | undefined = undefined;
  /** Help text */
  export let help: string | undefined = undefined;
  /**
   * Additional css classes
   */
  let clazz: string = '';
  export { clazz as class };

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
      <div class="">{value}</div>
    {:else if $$slots.value}
      <slot name="value" />
    {/if}
  </div>
</div>
