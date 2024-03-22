<script lang="ts">
  import '../app.css';
  import { Toaster } from '$lib/components/ui/sonner';
  import QueryClientContext from '$lib/components/context/QueryClientContext.svelte';
</script>

<QueryClientContext>

  <slot />

  <footer>
    <a href="https://github.com/createz-eth" target="_blank">GitHub</a>
  </footer>
  <Toaster richColors />
</QueryClientContext>
