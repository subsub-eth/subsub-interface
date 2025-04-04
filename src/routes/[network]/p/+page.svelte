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
  import { createQuery } from '@tanstack/svelte-query';
  import { derived as derivedStore } from 'svelte/store';
  import { log } from '$lib/logger';
  import { PaginatedLoadedList } from '$lib/components/ui2/paginatedloadedlist';
  import ProfileTeaser from '$lib/components/profile/ProfileTeaser.svelte';
  import { profileKeys } from '$lib/query/keys';
  import { url } from '$lib/url';
  import { page } from '$app/state';

  const pageSize = 5;

  let profileContract = $derived($chainEnvironment!.profileContract);
  let profileAddr = $derived($chainEnvironment!.chainData.contracts.profile);
  let currentAcc = $derived($currentAccount!);

  const profileTotalSupply = createQuery<number>(
    derivedStore(chainEnvironment, (chainEnv) => ({
      queryKey: profileKeys.totalSupply(chainEnv?.chainData.contracts.profile),
      queryFn: async () => {
        const supply = await totalSupply(chainEnv!.profileContract);
        log.debug('Total supply of profiles', supply);
        return supply;
      },
      enabled: !!chainEnv
    }))
  );

  const userProfileBalance = createQuery<number>(
    derivedStore([chainEnvironment, currentAccount], ([chainEnv, currentAcc]) => ({
      queryKey: profileKeys.balance(chainEnv?.chainData.contracts.profile, currentAcc),
      queryFn: async () => {
        const balance = await countUserProfiles(chainEnv!.profileContract, currentAcc!);
        log.debug('Balance of users profiles', currentAcc, balance);
        return balance;
      },
      enabled: !!chainEnv && !!currentAcc
    }))
  );
</script>

<h1>Profile overview</h1>

<div class="flex flex-row space-x-4">
  <div class="basis-1/2">
    <h2>My Profiles</h2>

    <div>
      <Button href={url(`/[network]/p/new/`, page)}>Mint new Profile</Button>
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
          totalItems={$userProfileBalance.data}
          {pageSize}
        >
          {#snippet children({ items })}
            {#each items as profileData (profileData.tokenId)}
              <ProfileTeaser profile={profileData} />
            {/each}
          {/snippet}
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
        totalItems={$profileTotalSupply.data}
        {pageSize}
      >
        {#snippet children({ items })}
          {#each items as profileData (profileData.tokenId)}
            <ProfileTeaser profile={profileData} />
          {/each}
        {/snippet}
      </PaginatedLoadedList>
    {/if}
  </div>
</div>
