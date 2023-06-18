<script lang="ts">
  import '../app.css';
  import HeaderWallet from '$lib/HeaderWallet.svelte';
  import {SvelteToast} from '@zerodevx/svelte-toast';

  const toastOptions = {};
</script>

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
