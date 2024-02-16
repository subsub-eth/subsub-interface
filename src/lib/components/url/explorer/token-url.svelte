<script lang="ts">
  import Base from './base.svelte';
  import type { Address } from '$lib/web3/contracts/common';
  import { tokenUrl } from '$lib/web3/blockexplorer';

  /** address of the token */
  export let contract: Address;

</script>

<Base createUrl={(expl) => tokenUrl(expl, contract)} let:url>
  <slot {url} />
</Base>
