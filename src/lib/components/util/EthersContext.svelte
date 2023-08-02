<script lang="ts">
  import { ethersSigner } from '$lib/web3/ethers';
</script>

{#if $ethersSigner}
  {@const signer = $ethersSigner}
  <slot ethersSigner={signer} />
{/if}
