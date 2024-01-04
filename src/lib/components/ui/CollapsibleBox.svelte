<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as Collapsible from '$lib/components/ui/collapsible';
  import { ChevronsDownUp, ChevronsUpDown } from 'lucide-svelte';

  /** Title */
  export let title: string;

  /** Collapsible is opened */
  export let open: boolean = false;

  /**
   * Additional css classes for the root container
   */
  export let rootClass: string | undefined = undefined;
</script>

<Card.Root class={rootClass}>
  <Collapsible.Root bind:open={open}>
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
        <slot />
      </Card.Content>
    </Collapsible.Content>
  </Collapsible.Root>
</Card.Root>
