<script lang="ts">
  import type { PageData } from './$types';
  import EditSubscriptionContractForm from '$lib/components/subscription/action/EditSubscriptionContractForm.svelte';
  import FlagsSubscriptionContractForm from '$lib/components/subscription/action/FlagsSubscriptionContractForm.svelte';
  import {
    setDescription,
    setExternalUrl,
    setImage,
    setFlags,
    type SubscriptionContractData,

    type WritableSubscription

  } from '$lib/web3/contracts/subscription';
  import { queryClient, type QueryResult } from '$lib/query/config';
  import { getContext } from 'svelte';
  import { WRITABLE_SUBSCRIPTION_CONTRACT_CTX, SUBSCRIPTION_DATA_CTX } from '../+layout.svelte';
  import toast from '$lib/toast';
  import type { Hash } from '$lib/web3/contracts/common';
  import { subKeys } from '$lib/query/keys';
  import Url from '$lib/components/Url.svelte';
  import { Button } from '$lib/components/ui/button';
  import { ChevronLeft } from 'lucide-svelte';

  export let data: PageData;

  const addr = data.subscriptionAddr;

  const subscriptionContract =
    getContext<QueryResult<WritableSubscription>>(WRITABLE_SUBSCRIPTION_CONTRACT_CTX);
  const subscriptionData = getContext<QueryResult<SubscriptionContractData>>(SUBSCRIPTION_DATA_CTX);

  const invalidateSubData = () =>
    queryClient.invalidateQueries({ queryKey: subKeys.contractUri(addr) });

  const updateScheduled = ({ detail: hash }: CustomEvent<Hash>) =>
    toast.info(`Update scheduled in Tx ${hash}`);

  const updated =
    (msg: (hash: Hash) => string) =>
    ({ detail: hash }: CustomEvent<Hash>) => {
      toast.info(msg(hash));
      invalidateSubData();
    };
  const flagsUpdated = ({ detail: hash }: CustomEvent<Hash>) => {
    toast.info(`Contract Flags updated in ${hash}`);
    invalidateSubData();
  };

  // TODO check if writable contract is available
  // TODO tx failed msgs
</script>

<Url template={`/[network]/s/${addr}/`} let:path>
  <Button href={path} size="icon" class="ml-auto self-center justify-self-end">
    <ChevronLeft className="h-4 w-4" />
    Back
  </Button>
</Url>

<h1>Edit Subscription Contract</h1>

<!-- TODO add all event function -->
{#if $subscriptionContract.isSuccess && $subscriptionData.isSuccess}
  {@const contract = $subscriptionContract.data}
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
  <FlagsSubscriptionContractForm
    formId={`flags-${data.address}`}
    data={$subscriptionData.data}
    setFlags={setFlags($subscriptionContract.data)}
    on:flagsChanged={flagsUpdated}
    on:txFailed
    on:flagsTxSubmitted={updateScheduled}
  />
{/if}
