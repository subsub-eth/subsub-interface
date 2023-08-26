<script lang="ts">
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import {
    CurrentAccountContext,
    ProfileContractContext,
    SubscriptionManagerContractContext
  } from '$lib/components/context/web3';
  import NewSubscriptionContractForm from '$lib/components/subscription-manager/NewSubscriptionContractForm.svelte';
  import { type Profile } from '@createz/contracts/types/ethers-contracts';
  import { toast } from '@zerodevx/svelte-toast';
  import { createSubscription } from '$lib/web3/contracts/subscription-manager';
  import { addressEquals } from '$lib/web3/helpers';

  export let data: PageData;

  const profileId = data.profile;

  const isOwner = async (
    contract: Profile,
    profileId: bigint,
    account: string
  ): Promise<boolean> => {
    const owner = await contract.ownerOf(profileId);
    console.debug('account === owner', account, owner);
    return addressEquals(account, owner);
  };

  const onTxSubmitted = (event: CustomEvent<string>) => {
    toast.push(`Transaction submitted: ${event.detail}`, { pausable: true });
  };

  const onContractCreated = (event: CustomEvent<[string, string]>) => {
    toast.push(`New Contract address: ${event.detail[0]}`, { pausable: true });
    goto(`/${$page.params.network}/s/${event.detail[0]}/`);
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

<SubscriptionManagerContractContext let:managerContract>
  <ProfileContractContext let:profileContract>
    <CurrentAccountContext let:currentAccount>
      {#await isOwner(profileContract, profileId, currentAccount)}
        Loading
      {:then isOwner}
        {#if isOwner}
          <NewSubscriptionContractForm
            create={createSubscription(managerContract, profileId)}
            on:txFailed={onTxFailed}
            on:createTxSubmitted={onTxSubmitted}
            on:created={onContractCreated}
          />
        {:else}
          Not the owner
        {/if}
      {:catch err}
        Failed to check owner {err}
      {/await}
    </CurrentAccountContext>
  </ProfileContractContext>
</SubscriptionManagerContractContext>
