<script lang="ts">
  import type { PageData } from './$types';
  import { derived } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import NewSubscriptionContractForm from '$lib/components/subscription/NewSubscriptionContractForm.svelte';
  import { erc6551CreateSubscription } from '$lib/web3/contracts/subscription-handle';
  import Url from '$lib/components/Url.svelte';
  import { addressEquals } from '$lib/web3/helpers';
  import { chainEnvironment } from '$lib/chain-context';
  import { currentAccount } from '$lib/web3/onboard';
  import toast from '$lib/toast';
  import { createQuery } from '@tanstack/svelte-query';
  import { log } from '$lib/logger';
  import { ownerOf } from '$lib/web3/contracts/profile';
  import Button from '$lib/components/Button.svelte';
  import NewAccount from '$lib/components/erc6551/NewAccount.svelte';
  import {
    findDefaultProfileErc6551Account,
    getErc6551Account,
    createErc6551Account,
    type TokenBoundAccount
  } from '$lib/web3/contracts/erc6551';
  import type { Address } from '$lib/web3/contracts/common';
  import { queryClient } from '$lib/query/config';
  import { erc6551Keys, profileKeys, subHandleKeys } from '$lib/query/keys';
  import { getErc20Contract, getErc20Data } from '$lib/web3/contracts/erc20';
    import { knownErc20Tokens } from '$lib/chain-config';

  export let data: PageData;

  const profileId = data.profile;

  const isOwner = createQuery<boolean>(
    derived([chainEnvironment, currentAccount], ([chainEnvironment, currentAccount]) => ({
      queryKey: profileKeys.tokenOwner(
        chainEnvironment!.chainData.contracts.profile,
        profileId,
        currentAccount!
      ),
      queryFn: async () => {
        const profileContract = chainEnvironment!.profileContract;
        const owner = await ownerOf(profileContract, profileId);
        return addressEquals(currentAccount, owner);
      }
    }))
  );

  const erc6551AccountAddress = createQuery<Address>(
    derived(chainEnvironment, (chainEnvironment) => ({
      queryKey: erc6551Keys.profileAccount(
        chainEnvironment!.chainData.contracts.erc6551Registry,
        chainEnvironment!.chainData.chainId,
        chainEnvironment!.chainData.contracts.profile,
        profileId
      ),
      queryFn: async () => (await findDefaultProfileErc6551Account(chainEnvironment!, profileId))!
    }))
  );

  const erc6551Account = createQuery<TokenBoundAccount | null>(
    derived([chainEnvironment, erc6551AccountAddress], ([chainEnvironment, addr]) => ({
      queryKey: erc6551Keys.account(addr.data!),
      queryFn: async () => {
        const signer = chainEnvironment!.ethersSigner;
        const account = await getErc6551Account(addr.data!, signer);
        return account;
      },
      enabled: addr.isSuccess && !!addr.data
    }))
  );

  $: createAccount = async () =>
    createErc6551Account(
      $chainEnvironment!.erc6551Registry,
      $chainEnvironment!.chainData.contracts.defaultErc6551Implementation,
      $chainEnvironment!.chainData.chainId,
      $chainEnvironment!.chainData.contracts.profile,
      profileId
    );

  $: tokenByAddress = async (addr: Address) => {
    const signer = $chainEnvironment!.ethersSigner;
    const { contract } = getErc20Contract(addr, signer);

    return await getErc20Data(contract);
  };

  $: knownTokens = knownErc20Tokens($chainEnvironment!.chainData.chainId);

  const onTxSubmitted = (event: CustomEvent<string>) => {
    toast.info(`Transaction submitted: ${event.detail}`);
  };

  const onContractCreated = (event: CustomEvent<[string, string]>) => {
    toast.info(`New Contract address: ${event.detail[0]}`);
    queryClient.invalidateQueries({
      queryKey: subHandleKeys.ownerList(
        $chainEnvironment!.chainData.contracts.subscriptionHandle,
        $currentAccount!
      )
    });
    // TODO FIXME
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

{#if $isOwner.isPending || $erc6551Account.isPending}
  Loading...
{:else if $isOwner.isError}
  Unable to determine ownership
{:else if $erc6551Account.isError}
  Unable to load token account: {$erc6551Account.error}
{:else if $isOwner.isSuccess && $erc6551AccountAddress.isSuccess && $erc6551Account.isSuccess}
  {@const isOwner = $isOwner.data}
  {@const erc6551Account = $erc6551Account.data}
  {#if isOwner}
    {#if !erc6551Account}
      <NewAccount create={createAccount} />
    {:else}
      <NewSubscriptionContractForm
        formId={`${$erc6551AccountAddress.data}`}
        create={erc6551CreateSubscription(erc6551Account[1], subHandle)}
        {tokenByAddress}
        knownTokens={knownTokens}
        on:txFailed={onTxFailed}
        on:createTxSubmitted={onTxSubmitted}
        on:created={onContractCreated}
      />
    {/if}
  {:else}
    Not the owner
  {/if}
{/if}
