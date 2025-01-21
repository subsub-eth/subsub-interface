<script lang="ts">
  import '../app.css';
  import { Toaster } from '$lib/components/ui/sonner';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import QueryClientContext from '$lib/components/context/QueryClientContext.svelte';
  import { ModeWatcher } from 'mode-watcher';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<svelte:head>
  <title>SubSub! - No BS Crypto Subscriptions</title>
</svelte:head>

<ModeWatcher defaultMode={'dark'} />
<QueryClientContext>
  <Tooltip.Provider>
    {@render children?.()}

    <footer>
      <a href="https://github.com/subsub-eth" target="_blank">GitHub</a>
    </footer>
    <Toaster richColors />
  </Tooltip.Provider>
</QueryClientContext>
