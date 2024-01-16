<script lang="ts">
  import type { Address } from '$lib/web3/contracts/common';
  import { chainEnvironment } from '$lib/chain-context';
  import { addressUrl } from '$lib/web3/blockexplorer';

  /** address to link to */
  export let address: Address;

  /** override explorerUrl getting the url from the context */
  export let explorerUrl: string | undefined = undefined;

  const createUrl = (addr: Address, explorerUrl: string | undefined) => {
    if (!explorerUrl) {
      return undefined;
    }
    return addressUrl(explorerUrl, address);
  };

  $: url = createUrl(address, explorerUrl ?? $chainEnvironment?.chainData.explorerUrl);
</script>

<slot {url} />
