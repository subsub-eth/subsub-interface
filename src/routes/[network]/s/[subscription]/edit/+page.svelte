<script lang="ts">
  import type { PageData } from './$types';
  import EditSubscriptionContractForm from '$lib/components/subscription/action/EditSubscriptionContractForm.svelte';
  import {
    setDescription,
    setExternalUrl,
    setImage,
    type SubscriptionContainer,
    type SubscriptionContractData
  } from '$lib/web3/contracts/subscription';
  import { queryClient, type QueryResult } from '$lib/query/config';
  import { getContext } from 'svelte';
  import { SUBSCRIPTION_CONTRACT_CTX, SUBSCRIPTION_DATA_CTX } from '../+layout.svelte';
  import { DATA, SUBSCRIPTION } from '$lib/query/keys';
  import toast from '$lib/toast';
  import type { Hash } from '$lib/web3/contracts/common';

  export let data: PageData;

  const addr = data.subscriptionAddr;

  const subscriptionContract =
    getContext<QueryResult<SubscriptionContainer>>(SUBSCRIPTION_CONTRACT_CTX);
  const subscriptionData = getContext<QueryResult<SubscriptionContractData>>(SUBSCRIPTION_DATA_CTX);

  const invalidateSubData = () =>
    queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION, addr, DATA] });

  const updateScheduled = ({ detail: hash }: CustomEvent<Hash>) =>
    toast.info(`Update scheduled in Tx ${hash}`);

  const updated =
    (msg: (hash: Hash) => string) =>
    ({ detail: [, hash] }: CustomEvent<[string, Hash]>) => {
      toast.info(msg(hash));
      invalidateSubData();
    };
</script>

<h1>Edit Subscription Contract</h1>

<!-- TODO add all event function -->
{#if $subscriptionContract.isSuccess && $subscriptionData.isSuccess}
  {@const contract = $subscriptionContract.data.contract}
  <EditSubscriptionContractForm
    data={$subscriptionData.data}
    setDescription={setDescription(contract)}
    setImage={setImage(contract)}
    setExternalUrl={setExternalUrl(contract)}
    on:descriptionTxSubmitted={updateScheduled}
    on:imageTxSubmitted={updateScheduled}
    on:externalUrlTxSubmitted={updateScheduled}
    on:descriptionChanged={updated((h) => `Description updated in Tx ${h}`)}
    on:imageChanged={updated((h) => `Image updated in Tx ${h}`)}
    on:externalUrlChanged={updated((h) => `External URL updated in Tx ${h}`)}
  />
{/if}
