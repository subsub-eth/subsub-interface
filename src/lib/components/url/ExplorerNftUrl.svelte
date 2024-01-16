<script lang="ts">
  import type { Address } from '$lib/web3/contracts/common';
  import { chainEnvironment } from '$lib/chain-context';
  import { nftUrl } from '$lib/web3/blockexplorer';

  /** address to link to */
  export let contract: Address;

  /** id of the NFT */
  export let tokenId: bigint;

  /** override explorerUrl getting the url from the context */
  export let explorerUrl: string | undefined = undefined;

  const createUrl = (addr: Address, tokenId: bigint, explorerUrl: string | undefined) => {
    if (!explorerUrl) {
      return undefined;
    }
    return nftUrl(explorerUrl, contract, tokenId);
  };

  $: url = createUrl(contract, tokenId, explorerUrl ?? $chainEnvironment?.chainData.explorerUrl);
</script>

<slot {url} />
