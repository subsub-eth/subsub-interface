<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<header class="flex flex-row items-center justify-between bg-black p-2 text-white">
  <div>
    <a href="/">Home</a>
  </div>

  <nav class="flex flex-row gap-4">
    <ul>docs</ul>
    <ul>X</ul>
  </nav>

  <div>
    {@render children?.()}
  </div>
</header>
