<script lang="ts">
  import "../app.css";
  import Wallet from "./Wallet.svelte";

</script>

<nav>
  <a href="/" >Home</a>
  <a href="/polygon">polygon</a>
</nav>

Wallet: <Wallet />

<slot></slot>

<footer>
  <a href="https://github.com/suiiii-rip" target="_blank">GitHub</a>
</footer>
