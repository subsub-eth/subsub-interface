<script lang="ts">
  import Base from './base.svelte';
  import type { Address } from '$lib/web3/contracts/common';
  import { addressUrl } from '$lib/web3/blockexplorer';

  /** address to link to */
  export let address: Address;

</script>

<Base createUrl={(expl) => addressUrl(expl, address)} let:url>
  <slot {url} />
</Base>
