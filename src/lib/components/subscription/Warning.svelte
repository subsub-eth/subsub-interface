<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { AlertTriangle, PauseCircle } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  export let text: string;
  /**
   * Classes
   */
  let clazz: string = 'h-8 w-8';
  export { clazz as class };

  const colorClass = 'stroke-red-500'
  let classes = cn(colorClass, clazz);
</script>

<Tooltip.Root>
  <Tooltip.Trigger>
    <AlertTriangle class={classes} />
  </Tooltip.Trigger>
  <Tooltip.Content>{text}</Tooltip.Content>
</Tooltip.Root>
