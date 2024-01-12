<script lang="ts">
  import '../app.css';
  import { browser } from '$app/environment';
  import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query';
  import HeaderWallet from '$lib/HeaderWallet.svelte';
  import { SvelteToast } from '@zerodevx/svelte-toast';

  const toastOptions = {};

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser
      }
    }
  });
</script>

<QueryClientProvider client={queryClient}>
  <header class="flex bg-black text-white">
    <div>
      <a href="/">Home</a>
    </div>

    <nav>
      <ul />
    </nav>

    <HeaderWallet />
  </header>

  <slot />

  <footer>
    <a href="https://github.com/createz-eth" target="_blank">GitHub</a>
  </footer>

  <SvelteToast options={toastOptions} />
</QueryClientProvider>
