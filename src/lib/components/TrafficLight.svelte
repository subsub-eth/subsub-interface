<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { Circle } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  /** CSS classes */

  interface Props {
    class?: string;
    status?: 'green' | 'yellow' | 'red';
    colorGreen?: string;
    colorYellow?: string;
    colorRed?: string;
    textGreen?: string;
    textYellow?: string;
    textRed?: string;
  }

  let {
    class: clazz = 'h-6 w-6',
    status = 'green',
    colorGreen = 'fill-green-500 stroke-green-500',
    colorYellow = 'fill-yellow-500 stroke-yellow-500',
    colorRed = 'fill-red-500 stroke-red-500',
    textGreen = 'Is active',
    textYellow = 'Almost inactive',
    textRed = 'Is inactive'
  }: Props = $props();

  let color: string = $state('');
  let text: string = $state('');

  $effect(() => {
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
  });

  let classes = $derived(cn(clazz, color));
</script>

<Tooltip.Root>
  <Tooltip.Trigger>
    <Circle class={classes} />
  </Tooltip.Trigger>
  <Tooltip.Content>{text}</Tooltip.Content>
</Tooltip.Root>
