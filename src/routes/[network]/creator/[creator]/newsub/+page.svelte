<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import NewSubscriptionContractForm from '$lib/components/subscription-manager/NewSubscriptionContractForm.svelte';
  import { SUBSCRIPTION_MANAGER_CONTRACT, requireContext } from '$lib/contexts';
  import { type ISubscriptionManager } from '@createz/contracts/types/ethers-contracts';
  import { toast } from '@zerodevx/svelte-toast';
  import type { Readable } from 'svelte/store';

  const managerContract = requireContext<Readable<ISubscriptionManager>>(
    SUBSCRIPTION_MANAGER_CONTRACT
  );

  const onTxSubmitted = (event: CustomEvent<string>) => {
    toast.push(`Transaction submitted: ${event.detail}`, { pausable: true });
  };

  const onContractCreated = (event: CustomEvent<string>) => {
    toast.push(`New Contract address: ${event.detail}`, { pausable: true });
    goto(`/${$page.params.network}/subscription/${event.detail}/`);
  };

  const onTxFailed = () => {
    toast.push('Transaction failed', {
      pausable: true,
      theme: {
        '--toastBackground': 'red',
        '--toastColor': 'white',
        '--toastBarBackground': 'fuchsia'
      }
    });
  };
</script>

<a href={`${$page.url.pathname}../`}>back</a>
<h1>New Subscription Contract</h1>

<NewSubscriptionContractForm
  managerContract={$managerContract}
  creatorId={BigInt($page.params.creator)}
  on:txFailed={onTxFailed}
  on:txSubmitted={onTxSubmitted}
  on:contractCreated={onContractCreated}
/>
