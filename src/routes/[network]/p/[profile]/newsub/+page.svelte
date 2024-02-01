<script lang="ts">
  import type { PageData } from './$types';
  import { derived } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import NewSubscriptionContractForm from '$lib/components/subscription/NewSubscriptionContractForm.svelte';
  import { createSubscription } from '$lib/web3/contracts/subscription-handle';
  import Url from '$lib/components/Url.svelte';
  import { addressEquals } from '$lib/web3/helpers';
  import { chainEnvironment } from '$lib/chain-context';
  import { currentAccount } from '$lib/web3/onboard';
  import toast from '$lib/toast';
  import { createQuery } from '@tanstack/svelte-query';
  import { log } from '$lib/logger';
  import { ownerOf } from '$lib/web3/contracts/profile';
  import Button from '$lib/components/Button.svelte';

  export let data: PageData;

  const profileId = data.profile;

  const isOwner = createQuery<boolean>(
    derived([chainEnvironment, currentAccount], ([chainEnvironment, currentAccount]) => ({
      queryKey: ['profileOwner', profileId.toString(), currentAccount],
      queryFn: async () => {
        log.debug('find profile', chainEnvironment);
        const profileContract = chainEnvironment!.profileContract;
        const owner = await ownerOf(profileContract, profileId);
        return addressEquals(currentAccount, owner);
      }
    }))
  );

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

  $: subHandle = $chainEnvironment!.subscriptionHandleContract;
</script>

<Url template={`/[network]/p/${profileId}/`} let:path>
  <Button label="back" href={path} />
</Url>
<h1>New Subscription Contract</h1>

{#if $isOwner.isPending}
  Loading...
{:else if $isOwner.isError}
  Unable to determine ownership
{:else if $isOwner.isSuccess}
  {#if $isOwner.data}
    <NewSubscriptionContractForm
      create={createSubscription(subHandle, profileId)}
      on:txFailed={onTxFailed}
      on:createTxSubmitted={onTxSubmitted}
      on:created={onContractCreated}
    />
  {:else}
    Not the owner
  {/if}
{/if}
