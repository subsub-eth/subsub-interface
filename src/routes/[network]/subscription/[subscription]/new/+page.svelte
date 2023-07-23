<script lang="ts">
  import { ethersSigner } from '$lib/web3/ethers';
  import { Subscription__factory } from '@createz/contracts/types/ethers-contracts';
  import type { PageData } from './$types';
  import { currentAccount } from '$lib/web3/onboard';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import MintSubscription from '$lib/components/subscription/action/MintSubscription.svelte';
  import { toast } from '@zerodevx/svelte-toast';

  export let data: PageData;

  const addr = data.subscriptionAddr;

  $: subContract = $ethersSigner ? Subscription__factory.connect(addr, $ethersSigner) : null;

  const onMinted = async (ev: CustomEvent<bigint>) => {
    toast.push(`New Subscription minted: ${ev.detail}`, { pausable: true });
    goto($page.url.pathname + '../' + ev.detail);
  };

  const toastMessage = (message: string) => toast.push(message, { pausable: true });
</script>

<h1>Mint new Subscription Token</h1>

{#if subContract && $currentAccount}
  <MintSubscription
    {subContract}
    currentAccount={$currentAccount}
    on:minted={onMinted}
    on:approved={(ev) => toastMessage(`Amount approved`)}
    on:mintTxSubmitted={(ev) => toast.push(`Mint Transaction submitted: ${ev.detail}`)}
    on:approvalTxSubmitted={(ev) => toast.push(`Approval Transaction submitted: ${ev.detail}`)}
    on:txFailed={(ev) =>
      toast.push(`Transaction failed: ${ev.detail}`, {
        pausable: true,
        theme: {
          '--toastBackground': 'red',
          '--toastColor': 'white',
          '--toastBarBackground': 'fuchsia'
        }
      })}
  />
{/if}
