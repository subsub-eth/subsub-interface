<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import SubscriptionContractList from '$lib/components/subscription-manager/SubscriptionContractList.svelte';
  import { addressEquals } from '$lib/web3/helpers';
  import ProfileDetails from '$lib/components/profile/ProfileDetails.svelte';
  import Button from '$lib/components/Button.svelte';
  import {
    CurrentAccountContext,
    EthersContext,
    ProfileContractContext,
    SubscriptionManagerContractContext
  } from '$lib/components/context/web3';
  import ProfileMetadataContext from '$lib/components/context/web3/ProfileMetadataContext.svelte';
  import { getSubscriptionContractAddresses } from '$lib/web3/contracts/subscription-manager';
  import { listSubscriptionContracts } from '$lib/web3/contracts/subscription';

  export let data: PageData;

  const tokenId = data.profile;

  const pageSize = 5;
</script>

<h1>Profile Details</h1>

<ProfileContractContext let:profileContract>
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
      <CurrentAccountContext let:currentAccount>
        {#await profileContract.ownerOf(tokenId)}
          Loading...
        {:then owner}
          {#if addressEquals(currentAccount, owner)}
            <Button
              primary={true}
              label="New Subscription Contract"
              href={`${$page.url.pathname}newsub/`}
            />
          {/if}
        {/await}
      </CurrentAccountContext>
      <div />
      <EthersContext let:ethersSigner>
        <SubscriptionManagerContractContext let:managerContract>
          {#await getSubscriptionContractAddresses(managerContract, tokenId)}
            Loading ...
          {:then addresses}
            {@const pages = Math.ceil(addresses.length / pageSize)}
            {@const load = listSubscriptionContracts(ethersSigner, addresses, pageSize)}

            <SubscriptionContractList {load} {pages} />
          {:catch err}
            Failed to load {err}
          {/await}
        </SubscriptionManagerContractContext>
      </EthersContext>
    </div>
  </div>
</ProfileContractContext>
