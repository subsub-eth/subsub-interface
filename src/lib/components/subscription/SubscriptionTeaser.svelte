<script lang="ts">
  import { NETWORK, requireContext } from '$lib/contexts';
  import type { SubscriptionTokenMetadata } from '$lib/web3/contracts/subscription';
  import { decodeDataJsonTokenURI } from '$lib/web3/helpers';
  import type { Subscription } from '@createz/contracts/types/ethers-contracts';

  export let contract: Subscription;
  export let tokenId: bigint;

  const network = requireContext<string>(NETWORK);

  $: subData = async () => {
    const addr = await contract.getAddress();
    const encoded = await contract.tokenURI(tokenId);
    let subData: [string, SubscriptionTokenMetadata] = [
      addr,
      decodeDataJsonTokenURI<SubscriptionTokenMetadata>(encoded)
    ];
    return subData;
  };
</script>

<div class="rounded-xl border-2 border-solid p-2">
  {#await subData()}
    Loading metadata of subscription {tokenId}
  {:then [address, metadata]}
    {#if !!metadata.image}
      <img src={metadata.image} alt={metadata.name} />
    {/if}
    <div>
      Title: {metadata.name}
    </div>
    <div>
      description: {metadata.description}
    </div>
    {#if !!metadata.external_url}
      <div>
        <a href={metadata.external_url}>external url</a>
      </div>
    {/if}
    {#each metadata.attributes ?? [] as attribute}
      <div>
        {attribute.trait_type}: {attribute.value}
      </div>
    {/each}
    <div>
      <a href={`/${network}/s/${address}/${tokenId}/`}>Details</a>
    </div>
  {:catch err}
    error: {err}
  {/await}
</div>
