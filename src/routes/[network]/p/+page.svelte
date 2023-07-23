<script lang="ts">
  import { currentAccount } from '$lib/web3/onboard';
  import {
    loadFirstOwnerTokenIds,
    loadLastAllTokenIds
  } from '$lib/web3/contracts/profile-functions';
  import type { Readable } from 'svelte/store';
  import { PROFILE_CONTRACT, requireContext } from '$lib/contexts';
  import { page } from '$app/stores';
  import type { Profile } from '@createz/contracts/types/ethers-contracts';
  import ProfileList from '$lib/components/profile/ProfileList.svelte';

  const profile = requireContext<Readable<Profile>>(PROFILE_CONTRACT);

  $: ownedTokens = $profile?.balanceOf($currentAccount + '');

  $: totalSupply = $profile?.totalSupply();
</script>

<h1>Profile overview</h1>

<div class="flex flex-row space-x-4">
  <div class="basis-1/2">
    <h2>My Profiles</h2>

    <div>
      <a
        href={`${$page.url.pathname}new/`}
        class="rounded-full bg-cyan-500 px-4 py-2 text-sm text-white shadow-sm">Mint new Profile</a
      >
    </div>

    <div>
      number of profile tokens:
      {#await ownedTokens}
        ...
      {:then balance}
        {balance}

        {#if !!profile}
          <ProfileList
            load={() => loadFirstOwnerTokenIds($profile, $currentAccount + '', 0n, Number(balance))}
            profile={$profile}
          />
        {/if}
      {:catch err}
        error
        {err}
      {/await}
    </div>
  </div>

  <div class="basis-1/2">
    <h2>Latest Creators</h2>
    {#await totalSupply}
      Loading...
    {:then totalSupply}
      total supply: {totalSupply}
      {#if !!$profile && totalSupply !== undefined}
        <ProfileList
          load={() =>
            loadLastAllTokenIds($profile, totalSupply - 1n, Math.min(5, Number(totalSupply)))}
          profile={$profile}
        />
      {/if}
    {:catch err}
      <!-- TODO -->
      error: {err}
    {/await}
  </div>
</div>
