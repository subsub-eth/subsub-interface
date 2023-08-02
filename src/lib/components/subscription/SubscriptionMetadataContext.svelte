<script lang="ts">
  import type { SubscriptionTokenMetadata } from '$lib/web3/contracts/subscription';
  import { decodeDataJsonTokenURI } from '$lib/web3/helpers';
  import type { Subscription } from '@createz/contracts/types/ethers-contracts';

  export let contract: Subscription;
  export let tokenId: bigint;

  let counter = 0;

  const loadMetadata = async (
    contract: Subscription,
    tokenId: bigint,
    counter: number
  ): Promise<[string, SubscriptionTokenMetadata]> => {
    const [addr, encoded] = await Promise.all([contract.getAddress(), contract.tokenURI(tokenId)]);

    const data = decodeDataJsonTokenURI<SubscriptionTokenMetadata>(encoded);

    return [addr, data];
  };

  const update = () => {
    counter++;
  }
</script>

{#await loadMetadata(contract, tokenId, counter)}
  Loading token metadata
{:then tokenMetadata}
  <slot {tokenMetadata} {update}/>
{:catch err}
  Failed to load metadata {err}
{/await}
