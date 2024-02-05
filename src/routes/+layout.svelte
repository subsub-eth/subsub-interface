<script lang="ts">
  import '../app.css';
  import { Toaster } from '$lib/components/ui/sonner';
  import HeaderWallet from '$lib/HeaderWallet.svelte';
  import QueryClientContext from '$lib/components/context/QueryClientContext.svelte';
</script>

<QueryClientContext>
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
  <Toaster richColors />
</QueryClientContext>
