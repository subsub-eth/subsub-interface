<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { Circle } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  /** CSS classes */
  let clazz: string = 'h-6 w-6';
  export { clazz as class };

  /** Blur effect */
  export let blurClass: string = 'blur-sm';

  let color = 'fill-green-500 stroke-green-500';

  let classes = cn(clazz, blurClass, color);
</script>

<Tooltip.Root>
  <Tooltip.Trigger>
    <Circle class={classes} />
  </Tooltip.Trigger>
  <Tooltip.Content>is active</Tooltip.Content>
</Tooltip.Root>
