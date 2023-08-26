<script lang="ts">
  import type { ProfileTokenMetadata } from '$lib/web3/contracts/profile';
  import { decodeDataJsonTokenURI } from '$lib/web3/helpers';
  import type { Profile } from '@createz/contracts/types/ethers-contracts';

  export let contract: Profile;
  export let tokenId: bigint;

  let counter = 0;

  let address: string;
  let metadata: ProfileTokenMetadata;

  $: (async () => {
    address = await contract.getAddress();
  })();

  $: (async () => {
    counter;
    const encoded = await contract.tokenURI(tokenId);
    metadata = decodeDataJsonTokenURI<ProfileTokenMetadata>(encoded);
  })();

  const update = async () => {
    counter++;
  };
</script>

{#if address && metadata}
  <slot {address} {metadata} {update} />
{:else}
  Loading profile metadata
{/if}
