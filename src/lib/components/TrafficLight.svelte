<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { Circle } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  /** CSS classes */
  let clazz: string = 'h-6 w-6';
  export { clazz as class };

  export let status: "green" | "yellow" | "red" = "green";

  export let colorGreen = 'fill-green-500 stroke-green-500';
  export let colorYellow = 'fill-yellow-500 stroke-yellow-500';
  export let colorRed = 'fill-red-500 stroke-red-500';

  export let textGreen = 'Is active';
  export let textYellow = 'Almost inactive';
  export let textRed = 'Is inactive';

  let color: string = '';
  let text: string = '';

  $: {
    if (status === 'green') {
      color = colorGreen;
      text = textGreen;
    } else if (status === 'yellow') {
      color = colorYellow;
      text = textYellow;
    } else if (status === 'red') {
      color = colorRed;
      text = textRed;
    }
  }

  $: classes = cn(clazz, color);
</script>

<Tooltip.Root>
  <Tooltip.Trigger>
    <Circle class={classes} />
  </Tooltip.Trigger>
  <Tooltip.Content>{text}</Tooltip.Content>
</Tooltip.Root>
