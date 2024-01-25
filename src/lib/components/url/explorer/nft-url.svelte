<script lang="ts">
  import Base from './base.svelte';
  import type { Address } from '$lib/web3/contracts/common';
  import { nftUrl } from '$lib/web3/blockexplorer';

  /** address to link to */
  export let contract: Address;

  /** id of the NFT */
  export let tokenId: bigint;

</script>

<Base createUrl={(expl) => nftUrl(expl, contract, tokenId)} let:url>
  <slot {url} />
</Base>
