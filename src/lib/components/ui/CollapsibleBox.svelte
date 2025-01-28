<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as Collapsible from '$lib/components/ui/collapsible';
  import { cn } from '$lib/utils';
  import { ChevronsDownUp, ChevronsUpDown } from 'lucide-svelte';

  interface Props {
    /** Title */
    title: string;
    /** Collapsible is opened */
    open?: boolean;
    /**
     * Additional css classes for the root container
     */
    rootClass?: string | undefined;
    /** Additional css class for the title */
    titleClass?: string | undefined;
    children?: import('svelte').Snippet;
  }

  let {
    title,
    open = $bindable(false),
    rootClass = undefined,
    titleClass = undefined,
    children
  }: Props = $props();
</script>

<Card.Root class={cn(rootClass, 'mt-4 pb-4')}>
  <Collapsible.Root bind:open>
    <Card.Header class="pt-4">
      <Collapsible.Trigger class="flex justify-between">
        <Card.Title class={cn(titleClass, 'flex-none text-lg')}>{title}</Card.Title>
        {#if open}
          <ChevronsDownUp className="h-4 w-4 flex-none" />
        {:else}
          <ChevronsUpDown className="h-4 w-4 flex-none" />
        {/if}
      </Collapsible.Trigger>
    </Card.Header>
    <Collapsible.Content>
      <Card.Content class="pb-2">
        {@render children?.()}
      </Card.Content>
    </Collapsible.Content>
  </Collapsible.Root>
</Card.Root>
