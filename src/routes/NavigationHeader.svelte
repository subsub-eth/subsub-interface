<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<header class="flex bg-black text-white">
  <div>
    <a href="/">Home</a>
  </div>

  <nav>
    <ul></ul>
  </nav>

  {@render children?.()}
</header>
