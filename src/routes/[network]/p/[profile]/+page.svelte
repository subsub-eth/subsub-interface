<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import SubscriptionContractList from '$lib/components/subscription-manager/SubscriptionContractList.svelte';
  import { addressEquals } from '$lib/web3/helpers';
  import ProfileDetails from '$lib/components/profile/ProfileDetails.svelte';
  import Button from '$lib/components/Button.svelte';
  import { EthersContext } from '$lib/components/context/web3';
  import ProfileMetadataContext from '$lib/components/context/web3/ProfileMetadataContext.svelte';
  import { getSubscriptionContractAddresses } from '$lib/web3/contracts/subscription-handle';
  import { listSubscriptionContracts } from '$lib/web3/contracts/subscription';
  import { chainEnvironment } from '$lib/chain-context';
  import { currentAccount } from '$lib/web3/onboard';
  import { findErc6551Account } from '$lib/web3/contracts/erc6551';

  export let data: PageData;

  const tokenId = data.profile;

  const pageSize = 5;

  $: ethersSigner = $chainEnvironment!.ethersSigner;
  $: profileContract = $chainEnvironment!.profileContract;
  $: handleContract = $chainEnvironment!.subscriptionHandleContract;
  $: currentAcc = $currentAccount!;

  const findOwnerAccount = async () => {
    const acc = await findErc6551Account(
      $chainEnvironment!.erc6551Registry,
      $chainEnvironment!.chainData.contracts.defaultErc6551Implementation,
      new Uint8Array(32),
      // '0x0000000000000000000000000000000000000000000000000000000000000000',
      $chainEnvironment!.chainData.chainId,
      $chainEnvironment!.chainData.contracts.profile,
      tokenId
    );

    return acc;
  };
</script>

<h1>Profile Details</h1>

<div class="flex flex-row space-x-4">
  <div class="basis-1/2">
    <ProfileMetadataContext {tokenId} contract={profileContract} let:metadata>
      <h2>Profile</h2>
      <ProfileDetails id={tokenId} {metadata} />
    </ProfileMetadataContext>
  </div>

  <div class="basis-1/2">
    <!-- TODO Subscription Contracts -->
    <h2>Subscription Contracts</h2>
    {#await profileContract.ownerOf(tokenId)}
      Loading...
    {:then owner}
      {#if addressEquals(currentAcc, owner)}
        <Button
          primary={true}
          label="New Subscription Contract"
          href={`${$page.url.pathname}newsub/`}
        />
      {/if}
    {/await}
    <div />
    <!-- TODO FIXME -->
    {#await findOwnerAccount()}
      Loading...
    {:then owner}
      {#await getSubscriptionContractAddresses(handleContract, owner)}
        Loading ...
      {:then addresses}
        {@const pages = Math.ceil(addresses.length / pageSize)}
        {@const load = listSubscriptionContracts(ethersSigner, addresses, pageSize)}

        <SubscriptionContractList {load} {pages} />
      {:catch err}
        Failed to load {err}
      {/await}
    {/await}
  </div>
</div>
