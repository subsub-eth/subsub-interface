<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import {
    countUserProfiles,
    listAllProfilesRev,
    listUserProfilesRev,
    totalSupply
  } from '$lib/web3/contracts/profile';
  import { chainEnvironment } from '$lib/chain-context';
  import { currentAccount } from '$lib/web3/onboard';
  import Url from '$lib/components/Url.svelte';
  import { createQuery } from '@tanstack/svelte-query';
  import { derived } from 'svelte/store';
  import { log } from '$lib/logger';
  import { PaginatedLoadedList } from '$lib/components/ui2/paginatedloadedlist';
  import ProfileTeaser from '$lib/components/profile/ProfileTeaser.svelte';
    import { profileKeys } from '$lib/query/keys';

  const pageSize = 5;

  $: profileContract = $chainEnvironment!.profileContract;
  $: profileAddr = $chainEnvironment!.chainData.contracts.profile;
  $: currentAcc = $currentAccount!;

  const profileTotalSupply = createQuery<number>(
    derived(chainEnvironment, (chainEnv) => ({
      queryKey: profileKeys.totalSupply(chainEnv!.chainData.contracts.profile),
      queryFn: async () => {
        const supply = await totalSupply(chainEnv!.profileContract);
        log.debug('Total supply of profiles', supply);
        return supply;
      }
    }))
  );

  const userProfileBalance = createQuery<number>(
    derived([chainEnvironment, currentAccount], ([chainEnv, currentAcc]) => ({
      queryKey: profileKeys.balance(chainEnv!.chainData.contracts.profile, currentAcc!),
      queryFn: async () => {
        const balance = await countUserProfiles(chainEnv!.profileContract, currentAcc!);
        log.debug('Balance of users profiles', currentAcc, balance);
        return balance;
      }
    }))
  );
</script>

<h1>Profile overview</h1>

<div class="flex flex-row space-x-4">
  <div class="basis-1/2">
    <h2>My Profiles</h2>

    <div>
      <Url template={`/[network]/p/new/`} let:path>
        <Button href={path} label="Mint new Profile" primary />
      </Url>
    </div>

    <div>
      {#if $userProfileBalance.isError}
        Failed to load Profiles
      {/if}
      {#if $userProfileBalance.isSuccess}
        {@const load = listUserProfilesRev(
          profileContract,
          currentAcc,
          pageSize,
          $userProfileBalance.data
        )}
        <PaginatedLoadedList
          {load}
          queryKeys={profileKeys.ownerList(profileAddr, currentAcc)}
          let:items
          totalItems={$userProfileBalance.data}
          {pageSize}
        >
          {#each items as profileData}
            <ProfileTeaser profile={profileData} />
          {/each}
        </PaginatedLoadedList>
      {/if}
    </div>
  </div>

  <div class="basis-1/2">
    <h2>Latest Creators</h2>
    {#if $profileTotalSupply.isError}
      Failed to load Profiles
    {/if}
    {#if $profileTotalSupply.isSuccess}
      {@const load = listAllProfilesRev(profileContract, pageSize, $profileTotalSupply.data)}
      <PaginatedLoadedList
        {load}
        queryKeys={profileKeys.list(profileAddr)}
        let:items
        totalItems={$profileTotalSupply.data}
        {pageSize}
      >
        {#each items as profileData}
          <ProfileTeaser profile={profileData} />
        {/each}
      </PaginatedLoadedList>
    {/if}
  </div>
</div>
