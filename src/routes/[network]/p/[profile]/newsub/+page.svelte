<script lang="ts">
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import NewSubscriptionContractForm from '$lib/components/subscription-manager/NewSubscriptionContractForm.svelte';
  import { type Profile } from '@createz/contracts/types/ethers-contracts';
  import { createSubscription } from '$lib/web3/contracts/subscription-handle';
  import { addressEquals } from '$lib/web3/helpers';
    import { chainEnvironment } from '$lib/chain-context';
    import { currentAccount } from '$lib/web3/onboard';
    import toast from '$lib/toast';

  export let data: PageData;

  const profileId = data.profile;

  let profileContract = $chainEnvironment!.profileContract;

  let currentAcc = $currentAccount!;

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
    toast.info(`Transaction submitted: ${event.detail}`);
  };

  const onContractCreated = (event: CustomEvent<[string, string]>) => {
    toast.info(`New Contract address: ${event.detail[0]}`);
    goto(`/${$page.params.network}/s/${event.detail[0]}/`);
  };

  const onTxFailed = () => {
    toast.error('Transaction failed');
  };
</script>

<a href={`${$page.url.pathname}../`}>back</a>
<h1>New Subscription Contract</h1>

      {#await isOwner(profileContract, profileId, currentAcc)}
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
