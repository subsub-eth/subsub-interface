<script lang="ts">
  import NewSubscription from '$lib/components/subscription/NewSubscription.svelte';
  import { ethersSigner } from '$lib/web3/ethers';
  import { Subscription__factory } from '@createz/contracts/types/ethers-contracts';
  import type { PageData } from './$types';
    import { currentAccount } from '$lib/web3/onboard';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

  export let data: PageData;

  const addr = data.subscriptionAddr;

  $: subContract = $ethersSigner ? Subscription__factory.connect(addr, $ethersSigner) : null;

  const onMinted = async (ev: CustomEvent<string>) => {
    goto($page.url.pathname + '../' + ev.detail);
  }
</script>

<h1>Mint new Subscription Token</h1>

{#if subContract && $currentAccount}
  <NewSubscription {subContract} currentAccount={$currentAccount} on:minted={onMinted}/>
{/if}
