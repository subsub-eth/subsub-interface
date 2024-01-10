<script lang="ts">
  import { page } from '$app/stores';
  import ProfileList from '$lib/components/profile/ProfileList.svelte';
  import Button from '$lib/components/Button.svelte';
  import {
    countUserProfiles,
    listAllProfilesRev,
    listUserProfilesRev,
    totalSupply
  } from '$lib/web3/contracts/profile';
  import { chainEnvironment } from '$lib/chain-context';
  import { currentAccount } from '$lib/web3/onboard';

  const pageSize = 5;

  $: profileContract = $chainEnvironment!.profileContract;
  $: currentAcc = $currentAccount!;
</script>

<h1>Profile overview</h1>

<div class="flex flex-row space-x-4">
  <div class="basis-1/2">
    <h2>My Profiles</h2>

    <div>
      <Button href={`${$page.url.pathname}new/`} label="Mint new Profile" primary />
    </div>

    <div>
      number of profile tokens:
      {#await countUserProfiles(profileContract, currentAcc)}
        Loading ...
      {:then balance}
        {balance}
        <ProfileList
          pages={Math.ceil(balance / pageSize)}
          load={listUserProfilesRev(profileContract, currentAcc, pageSize, balance)}
        />
      {:catch err}
        error
        {err}
      {/await}
    </div>
  </div>

  <div class="basis-1/2">
    <h2>Latest Creators</h2>
    <!-- TODO cache / prevent re-loading on account switch etc -->
    {#await totalSupply(profileContract)}
      Loading...
    {:then totalSupply}
      total supply: {totalSupply}
      <ProfileList
        pages={Math.ceil(totalSupply / pageSize)}
        load={listAllProfilesRev(profileContract, pageSize, totalSupply)}
      />
    {:catch err}
      <!-- TODO -->
      error: {err}
    {/await}
  </div>
</div>
