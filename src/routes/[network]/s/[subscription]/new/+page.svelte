<script lang="ts">
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import MintSubscription from '$lib/components/subscription/action/MintSubscription.svelte';
  import { toast } from '@zerodevx/svelte-toast';
    import EthersContext from '$lib/components/util/EthersContext.svelte';
    import SubscriptionContractContext from '$lib/components/util/SubscriptionContractContext.svelte';
    import CurrentAccountContext from '$lib/components/util/CurrentAccountContext.svelte';
    import SubscriptionContractMetadataContext from '$lib/components/subscription/SubscriptionContractMetadataContext.svelte';

  export let data: PageData;

  const addr = data.subscriptionAddr;

  const onMinted = async (ev: CustomEvent<bigint>) => {
    toast.push(`New Subscription minted: ${ev.detail}`, { pausable: true });
    goto($page.url.pathname + '../' + ev.detail);
  };

  const toastMessage = (message: string) => toast.push(message, { pausable: true });
</script>

<h1>Mint new Subscription Token</h1>

<EthersContext let:ethersSigner>
<SubscriptionContractContext address={addr} {ethersSigner} let:subscriptionContract >
<SubscriptionContractMetadataContext contract={subscriptionContract} let:metadata>
<CurrentAccountContext let:currentAccount >
  <MintSubscription
    {subscriptionContract}
    currentAccount={currentAccount}
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
</CurrentAccountContext>
</SubscriptionContractMetadataContext>
</SubscriptionContractContext>
</EthersContext>
