<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { PauseCircle } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  /**
   * Classes
   */
  let clazz: string = 'h-8 w-8';
  export { clazz as class };

  const colorClass = 'stroke-yellow-500'
  let classes = cn(colorClass, clazz);
</script>

<Tooltip.Root>
  <Tooltip.Trigger>
    <PauseCircle class={classes} />
  </Tooltip.Trigger>
  <Tooltip.Content>Subscription Plan is paused and does not accept renewals</Tooltip.Content>
</Tooltip.Root>
