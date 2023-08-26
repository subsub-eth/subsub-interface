<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { Readable } from 'svelte/store';
  import type { Profile } from '@createz/contracts/types/ethers-contracts';
  import { PROFILE_CONTRACT, requireContext } from '$lib/contexts';
  import NewProfile from '$lib/components/profile/NewProfile.svelte';
  import { CurrentAccountContext, ProfileContractContext } from '$lib/components/context/web3';
  import { mint } from '$lib/web3/contracts/profile';

  const profile = requireContext<Readable<Profile>>(PROFILE_CONTRACT);

  const onSuccess = (id: bigint) => {
    goto($page.url.pathname + `../${id}`); // TODO fix this
  };
</script>

<h1>Create new Creator Token</h1>
<ProfileContractContext let:profileContract>
  <CurrentAccountContext let:currentAccount>
    <p>contract: <span>{#await $profile.getAddress() then addr}{addr}{/await}</span></p>

    <NewProfile
      mint={mint(profileContract, currentAccount)}
      on:minted={(ev) => onSuccess(ev.detail[0])}
    />
  </CurrentAccountContext>
</ProfileContractContext>
