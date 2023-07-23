<script lang="ts">
  import { currentAccount } from '$lib/web3/onboard';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { Readable } from 'svelte/store';
  import type { Profile } from '@createz/contracts/types/ethers-contracts';
  import { PROFILE_CONTRACT, requireContext } from '$lib/contexts';
  import NewProfile from '$lib/components/profile/NewProfile.svelte';

  const profile = requireContext<Readable<Profile>>(PROFILE_CONTRACT);

  const onSuccess = (id: bigint) => {
    goto($page.url.pathname + `../${id}`); // TODO fix this
  };
</script>

<h1>Create new Creator Token</h1>
{#if !!$profile && !!$currentAccount}
  <p>contract: <span>{#await $profile.getAddress() then addr}{addr}{/await}</span></p>

  <NewProfile profile={$profile} currentAccount={$currentAccount} {onSuccess} />
{/if}
