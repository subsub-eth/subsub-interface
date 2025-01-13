<script lang="ts">
  import LightSwitch from '$lib/LightSwitch.svelte';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<header class="flex flex-row items-center justify-between bg-sidebar p-2 text-foreground">
  <div>
    <a href="/">Home</a>
  </div>

  <nav class="flex flex-row gap-4">
    <ul>docs</ul>
    <ul>X</ul>
  </nav>

  <div class="flex flex-row gap-4">
    <LightSwitch />
    {@render children?.()}
  </div>
</header>
