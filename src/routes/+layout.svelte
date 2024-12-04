<script lang="ts">
  import '../app.css';
  import { Toaster } from '$lib/components/ui/sonner';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import QueryClientContext from '$lib/components/context/QueryClientContext.svelte';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<QueryClientContext>
  <Tooltip.Provider>
    {@render children?.()}

    <footer>
      <a href="https://github.com/createz-eth" target="_blank">GitHub</a>
    </footer>
    <Toaster richColors />
  </Tooltip.Provider>
</QueryClientContext>
