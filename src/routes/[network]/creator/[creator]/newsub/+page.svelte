<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import NewSubscriptionContractForm from '$lib/components/subscription-manager/NewSubscriptionContractForm.svelte';
  import { SUBSCRIPTION_MANAGER_CONTRACT, requireContext } from '$lib/contexts';
  import type { SubscriptionContractProps } from '$lib/web3/contracts/subscription-manager';
  import { matchEvents } from '$lib/web3/ethers';
  import { currentAccount } from '$lib/web3/onboard';
  import { type ISubscriptionManager } from '@createz/contracts/types/ethers-contracts';
  import type {
    MetadataStruct,
    SubSettingsStruct
  } from '@createz/contracts/types/ethers-contracts/ISubscriptionManager.sol/ISubscriptionManager';
  import { toast } from '@zerodevx/svelte-toast';
  import type { Readable } from 'svelte/store';

  const managerContract = requireContext<Readable<ISubscriptionManager>>(
    SUBSCRIPTION_MANAGER_CONTRACT
  );

  const onSubmit = async (val: SubscriptionContractProps) => {
    const metadata: MetadataStruct = {
      title: val.metadata.name,
      description: val.metadata.description ?? '',
      image: val.metadata.image ?? '',
      externalUrl: val.metadata.external_url ?? ''
    };

    const subSettings: SubSettingsStruct = {
      token: val.subSettings.token,
      rate: val.subSettings.rate,
      lock: val.subSettings.lock,
      epochSize: val.subSettings.epochSize
    };

    try {
      const tx = await $managerContract.createSubscription(
        val.name,
        val.symbol,
        metadata,
        subSettings,
        $page.params.creator
      );

      toast.push(`Transaction submitted: ${tx.hash}`, { pausable: true });
      const receipt = await tx.wait();

      const logs = receipt?.logs;
      if ($currentAccount) {
        const res = await matchEvents(
          logs as [],
          $managerContract,
          $managerContract.filters.SubscriptionContractCreated($currentAccount)
        );
        if (res[0]) {
          const newContract = res[0].args.contractAddress;
          toast.push(`New Contract address: ${newContract}`, { pausable: true });
          goto(`/${$page.params.network}/subscription/${newContract}/`);
        }
      }

      // TODO weird state
      return true;
    } catch (err) {
      toast.push('Transaction failed', {
        pausable: true,
        theme: {
          '--toastBackground': 'red',
          '--toastColor': 'white',
          '--toastBarBackground': 'fuchsia'
        }
      });
      throw err;
    }
  };
</script>

<a href={`${$page.url.pathname}../`}>back</a>
<h1>New Subscription Contract</h1>

<NewSubscriptionContractForm {onSubmit} />
