<script lang="ts">
  import LightSwitch from '$lib/LightSwitch.svelte';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<header class="bg-sidebar text-foreground flex flex-row items-center justify-between p-2">
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
