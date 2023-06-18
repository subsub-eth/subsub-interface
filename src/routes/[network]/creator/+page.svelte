<script lang="ts">
  import { currentAccount } from '$lib/web3/onboard';
  import {
    loadFirstOwnerTokenIds,
    loadLastAllTokenIds
  } from '$lib/web3/contracts/creator-functions';
  import CreatorList from '$lib/components/creator/CreatorList.svelte';
  import type { Readable } from 'svelte/store';
  import type { Creator } from '@createz/contracts/types/ethers-contracts/Creator';
  import { CREATOR_CONTRACT, requireContext } from '$lib/contexts';
  import { page } from '$app/stores';

  const creator = requireContext<Readable<Creator>>(CREATOR_CONTRACT);

  $: ownedTokens = $creator?.balanceOf($currentAccount + '');

  $: totalSupply = $creator?.totalSupply();
</script>

<h1>Creator overview</h1>

<h2>My Creators</h2>

<div>
  <a href={`${$page.url.pathname}new/`}>Mint new Creator Profile</a>
</div>

<div>
  number of creator tokens:
  {#await ownedTokens}
    ...
  {:then balance}
    {balance}

    {#if $creator !== null}
      {@const creator = $creator}
      <CreatorList
        load={() => loadFirstOwnerTokenIds(creator, $currentAccount + '', 0n, Number(balance))}
      />
    {/if}
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
  {#if $creator !== null && totalSupply !== undefined}
    {@const creator = $creator}
    <CreatorList
      load={() => loadLastAllTokenIds(creator, totalSupply - 1n, Math.min(5, Number(totalSupply)))}
    />
  {/if}
{:catch err}
  <!-- TODO -->
  error: {err}
{/await}
