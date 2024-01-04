<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import type { ComponentType, SvelteComponent } from 'svelte';

  /** Title of the property */
  export let title: string;

  /** Main property value */
  export let value: string | undefined = undefined;

  /** Muted secondary value */
  export let subValue: string | undefined = undefined;

  /** Logo component to render */
  export let titleLogo: ComponentType<SvelteComponent> | undefined = undefined;

  /**
   * Additional css classes for the root container
   */
  export let rootClass: string | undefined = undefined;

</script>

<Card.Root class={rootClass}>
  <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
    <Card.Title class="text-sm font-medium">
      {title}
    </Card.Title>
    {#if titleLogo}
      <svelte:component this={titleLogo} class="h-4 w-4 text-muted-foreground" />
    {:else if $$slots.titleLogo}
      <slot name="titleLogo" />
    {/if}
  </Card.Header>
  <Card.Content>
    {#if value}
      <div class="text-2xl font-bold">{value}</div>
    {:else if $$slots.value}
      <slot name="value" />
    {/if}
    {#if subValue}
      <p class="text-xs text-muted-foreground">{subValue}</p>
    {:else if $$slots.subValue}
      <slot name="subValue" />
    {/if}
  </Card.Content>
</Card.Root>
