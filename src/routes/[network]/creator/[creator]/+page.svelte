<script lang="ts">
  import { CREATOR_CONTRACT, requireContext } from '$lib/contexts';
  import type { Creator } from '@createz/contracts/types/ethers-contracts/Creator';
  import type { Readable } from 'svelte/store';
  import { page } from '$app/stores';
  import CreatorDetails from '$lib/components/creator/CreatorDetails.svelte';

  const tokenId = BigInt($page.params.creator);
  const creatorContract = requireContext<Readable<Creator>>(CREATOR_CONTRACT);
</script>

<CreatorDetails id={tokenId} creator={$creatorContract} />

<!-- TODO Subscription Contracts -->
