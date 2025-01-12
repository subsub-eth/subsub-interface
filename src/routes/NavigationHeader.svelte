<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<header class="flex flex-row justify-between bg-black text-white p-2">
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
