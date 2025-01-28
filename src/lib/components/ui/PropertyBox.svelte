<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import type { ComponentType, Component, SvelteComponent, Snippet } from 'svelte';

  interface Props {
    title: string;
    rootClass?: string;

    value?: string | Snippet;
    subValue?: string | Snippet;

    TitleIcon?: ComponentType<SvelteComponent> | Component;
  }

  let { title, rootClass, value, subValue, TitleIcon }: Props = $props();

  const extract = (v: undefined | string | Snippet): { st?: string; sn?: Snippet } => {
    const isString = typeof v == 'string';

    return { st: isString ? v : undefined, sn: !isString ? v : undefined };
  };
</script>

<Card.Root class={rootClass}>
  <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
    <Card.Title class="text-sm font-medium">
      {title}
    </Card.Title>
    {#if TitleIcon}
      <TitleIcon class="text-muted-foreground h-4 w-4" />
    {/if}
  </Card.Header>
  <Card.Content>
    {@const v = extract(value)}
    {#if v.st}
      <div class="text-2xl font-bold">{v.st}</div>
    {:else if v.sn}
      {@render v.sn()}
    {/if}
    {@const sv = extract(subValue)}
    {#if sv.st}
      <p class="text-muted-foreground text-xs">{sv.st}</p>
    {:else if sv.sn}
      {@render sv.sn()}
    {/if}
  </Card.Content>
</Card.Root>
