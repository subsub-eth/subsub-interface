<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { AlertTriangle } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  /**
   * Classes
   */
  interface Props {
    text: string;
    class?: string;
  }

  let { text, class: clazz = 'h-8 w-8' }: Props = $props();

  const colorClass = 'stroke-red-500';
  let classes = cn(colorClass, clazz);
</script>

<Tooltip.Root>
  <Tooltip.Trigger>
    <AlertTriangle class={classes} />
  </Tooltip.Trigger>
  <Tooltip.Content>{text}</Tooltip.Content>
</Tooltip.Root>
