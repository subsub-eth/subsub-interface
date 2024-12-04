<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as Collapsible from '$lib/components/ui/collapsible';
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
    children?: import('svelte').Snippet;
  }

  let { title, open = $bindable(false), rootClass = undefined, children }: Props = $props();
</script>

<Card.Root class={rootClass}>
  <Collapsible.Root bind:open>
    <Card.Header>
      <Collapsible.Trigger class="flex justify-between">
        <Card.Title class="flex-none">{title}</Card.Title>
        {#if open}
          <ChevronsDownUp className="h-4 w-4 flex-none" />
        {:else}
          <ChevronsUpDown className="h-4 w-4 flex-none" />
        {/if}
      </Collapsible.Trigger>
    </Card.Header>
    <Collapsible.Content>
      <Card.Content>
        {@render children?.()}
      </Card.Content>
    </Collapsible.Content>
  </Collapsible.Root>
</Card.Root>
