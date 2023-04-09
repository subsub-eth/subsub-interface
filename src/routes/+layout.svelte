<script lang="ts">
  import "../app.css";
  import Wallet from "./Wallet.svelte";

  import { chains } from "$lib/web3/chains";

</script>

<nav>
  <a href="/" >Home</a>
  {#each chains as chain}
    <a href="/{chain.name}">{chain.label}</a>
  {/each}
</nav>

Wallet: <Wallet />

<slot></slot>

<footer>
  <a href="https://github.com/createz-eth" target="_blank">GitHub</a>
</footer>
