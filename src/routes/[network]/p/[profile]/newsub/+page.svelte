<script lang="ts">
  import type { PageData } from './$types';
  import { derived as derivedStore } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import NewSubscriptionContractForm from '$lib/components/subscription/NewSubscriptionContractForm.svelte';
  import { erc6551CreateSubscription } from '$lib/web3/contracts/subscription-handle';
  import { addressEquals } from '$lib/web3/helpers';
  import { writableChainEnvironment as chainEnvironment } from '$lib/chain-context';
  import { currentAccount } from '$lib/web3/onboard';
  import toast from '$lib/toast';
  import { createQuery } from '@tanstack/svelte-query';
  import { ownerOf } from '$lib/web3/contracts/profile';
  import Button from '$lib/components/Button.svelte';
  import NewAccount from '$lib/components/erc6551/NewAccount.svelte';
  import {
    findDefaultProfileErc6551Account,
    getErc6551Account,
    createErc6551Account,
    type TokenBoundAccount
  } from '$lib/web3/contracts/erc6551';
  import type { Address, Hash } from '$lib/web3/contracts/common';
  import { queryClient } from '$lib/query/config';
  import { erc6551Keys, profileKeys, subHandleKeys } from '$lib/query/keys';
  import { getErc20Contract, getErc20Data } from '$lib/web3/contracts/erc20';
  import { getChainId, knownErc20Tokens } from '$lib/chain-config';
  import { url } from '$lib/url';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const profileId = data.profile;

  const isOwner = createQuery<boolean>(
    derivedStore([chainEnvironment, currentAccount], ([chainEnvironment, currentAccount]) => ({
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
    derivedStore(chainEnvironment, (chainEnvironment) => ({
      queryKey: erc6551Keys.profileAccount(
        chainEnvironment!.chainData.contracts.erc6551Registry,
        getChainId(chainEnvironment!.chainData),
        chainEnvironment!.chainData.contracts.profile,
        profileId
      ),
      queryFn: async () => (await findDefaultProfileErc6551Account(chainEnvironment!, profileId))!
    }))
  );

  const erc6551Account = createQuery<TokenBoundAccount | null>(
    derivedStore([chainEnvironment, erc6551AccountAddress], ([chainEnvironment, addr]) => ({
      queryKey: erc6551Keys.account(addr.data!),
      queryFn: async () => {
        const publicClient = chainEnvironment!.publicClient;
        const walletClient = chainEnvironment!.walletClient;
        const account = await getErc6551Account(addr.data!, publicClient, walletClient);
        return account;
      },
      enabled: addr.isSuccess && !!addr.data
    }))
  );

  let createAccount = $derived(async () =>
    createErc6551Account(
      $chainEnvironment!.erc6551Registry,
      $chainEnvironment!.chainData.contracts.defaultErc6551Implementation,
      getChainId($chainEnvironment!.chainData)!,
      $chainEnvironment!.chainData.contracts.profile,
      profileId
    )
  );

  let tokenByAddress = $derived(async (addr: Address) => {
    const client = $chainEnvironment!.publicClient;
    const contract = getErc20Contract(addr, client);

    return await getErc20Data(contract);
  });

  let knownTokens = $derived(knownErc20Tokens($chainEnvironment!.chainData.chain.id));

  const onTxSubmitted = (tx: Hash) => {
    toast.info(`Transaction submitted: ${tx}`);
  };

  const onContractCreated = (addr: Address, tx: Hash) => {
    toast.info(`New Contract address: ${addr} created in ${tx}`);
    queryClient.invalidateQueries({
      queryKey: subHandleKeys.ownerList(
        $chainEnvironment!.chainData.contracts.subscriptionHandle,
        $currentAccount!
      )
    });
    // TODO FIXME
    goto(`/${page.params.network}/s/${addr}/`);
  };

  const onTxFailed = () => {
    toast.error('Transaction failed');
  };

  let subHandle = $derived($chainEnvironment!.subscriptionHandleContract);
</script>

<Button href={url(`/[network]/p/${profileId}/`, page)}>Back</Button>

<h1>New Subscription Contract</h1>

TODO: handle erc6551 properly for write access
{#if $isOwner.isPending || $erc6551Account.isPending}
  Loading...
{:else if $isOwner.isError}
  Unable to determine ownership
{:else if $erc6551Account.isError}
  Unable to load token account: {$erc6551Account.error}
{:else if $isOwner.isSuccess && $erc6551AccountAddress.isSuccess && $erc6551Account.isSuccess}
  {@const _isOwner = $isOwner.data}
  {@const _erc6551Account = $erc6551Account.data}
  {#if _isOwner}
    {#if !_erc6551Account}
      <NewAccount create={createAccount} />
    {:else}
      <NewSubscriptionContractForm
        formId={`${$erc6551AccountAddress.data}`}
        create={erc6551CreateSubscription(_erc6551Account[1]!, subHandle)}
        {tokenByAddress}
        {knownTokens}
        {onTxFailed}
        onCreateTxSubmitted={onTxSubmitted}
        onCreated={onContractCreated}
      />
    {/if}
  {:else}
    Not the owner
  {/if}
{/if}
