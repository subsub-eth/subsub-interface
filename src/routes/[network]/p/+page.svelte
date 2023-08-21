<script lang="ts">
  import { page } from '$app/stores';
  import ProfileList from '$lib/components/profile/ProfileList.svelte';
  import Button from '$lib/components/Button.svelte';
  import { CurrentAccountContext, ProfileContractContext } from '$lib/components/context/web3';
  import {
    countUserProfiles,
    listAllProfilesRev,
    listUserProfilesRev,
    totalSupply
  } from '$lib/web3/contracts/profile';

  const pageSize = 5;
</script>

<h1>Profile overview</h1>

<ProfileContractContext let:profileContract>
  <div class="flex flex-row space-x-4">
    <div class="basis-1/2">
      <h2>My Profiles</h2>

      <div>
        <Button href={`${$page.url.pathname}new/`} label="Mint new Profile" primary />
      </div>

      <div>
        <CurrentAccountContext let:currentAccount>
          number of profile tokens:
          {#await countUserProfiles(profileContract, currentAccount)}
            Loading ...
          {:then balance}
            {balance}
            <ProfileList
              pages={Math.ceil(balance / pageSize)}
              load={listUserProfilesRev(profileContract, currentAccount, pageSize, balance)}
            />
          {:catch err}
            error
            {err}
          {/await}
        </CurrentAccountContext>
      </div>
    </div>

    <div class="basis-1/2">
      <h2>Latest Creators</h2>
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
</ProfileContractContext>
