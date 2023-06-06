<script lang="ts">
  import type { PageData } from './types';

  import { Creator__factory } from '@createz/contracts/types/ethers-contracts/factories/Creator__factory';

  import { ethersProvider$ } from '$lib/web3/ethers';
  import { map } from 'rxjs';
  import { creatorContractAddr } from '$lib/contractCoordinates';

  export let data: PageData;

  $: creator = ethersProvider$.pipe(
    map((provider) => {
      return Creator__factory.connect(creatorContractAddr, provider as any);
    })
  );
</script>

<h1>creator: {data.creator}</h1>
<h2>network: {data.network}</h2>
{#if !!$creator}
  {#await $creator.ownerOf(data.creator)}
    looking up
  {:then owner}
    owner: {owner}
  {:catch err}
    error
    {err}
  {/await}
{:else}
  no creator contract
{/if}
