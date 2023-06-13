<script lang="ts">
  import { Creator__factory } from '@createz/contracts/types/ethers-contracts/factories/Creator__factory';

  import { ethersProvider } from '$lib/web3/ethers';
  import { creatorContractAddr } from '$lib/chain-config';
  import { currentAccount } from '$lib/web3/onboard';
  import { loadFirstOwnerTokenIds, loadLastAllTokenIds } from '$lib/web3/contracts/creator-functions';
  import CreatorList from '$lib/components/creator/CreatorList.svelte';
    import type { ContractRunner } from 'ethers';

  $: creator = Creator__factory.connect(
    creatorContractAddr,
    $ethersProvider as ContractRunner
  );

  $: ownedTokens = creator.balanceOf($currentAccount + '');

  $: totalSupply = creator.totalSupply();
</script>

<h1>Creator overview</h1>

<h2>My Creators</h2>

<div>
  number of creator tokens:
  {#await ownedTokens}
    ...
  {:then balance}
    {balance}

  <CreatorList
    load={() => loadFirstOwnerTokenIds(creator, $currentAccount + '', 0n, Number(balance))}
  />
  {:catch err}
    error
    {err}
  {/await}
</div>

<h2>Latest Creators</h2>
{#await totalSupply}
  Loading...
{:then totalSupply}
  total supply: {totalSupply}
  <CreatorList
    load={() => loadLastAllTokenIds(creator, totalSupply - 1n, Math.min(5, Number(totalSupply)))}
  />
{:catch err}
  <!-- TODO -->
  error: {err}
{/await}
