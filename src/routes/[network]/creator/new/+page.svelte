<script lang="ts">
  import { currentAccount } from '$lib/web3/onboard';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { CREATOR_CONTRACT, requireContext } from '$lib/contexts';
  import type { Creator } from '@createz/contracts/types/ethers-contracts/Creator';
  import type { Readable } from 'svelte/store';
  import NewCreator from '$lib/components/creator/NewCreator.svelte';

  const creator = requireContext<Readable<Creator>>(CREATOR_CONTRACT);

  const onSuccess = (id: bigint) => {
    goto($page.url.pathname + `../${id}`); // TODO fix this
  };
</script>

<h1>Create new Creator Token</h1>
<p>contract: <span>{#await $creator.getAddress() then addr}{addr}{/await}</span></p>

<NewCreator creator={$creator} currentAccount={$currentAccount ?? ''} {onSuccess} />
