<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { chainEnvironment } from '$lib/chain-context';
  import NewProfile from '$lib/components/profile/NewProfile.svelte';
  import { urlFromTemplate } from '$lib/url';
  import { mint } from '$lib/web3/contracts/profile';
  import { currentAccount } from '$lib/web3/onboard';

  $: onSuccess = (id: bigint) => {
    goto(urlFromTemplate(`/[network]/p/${id}`, $page.params));
  };

  $: currAcc = $currentAccount!;
  $: profileContract = $chainEnvironment!.profileContract;
</script>

<h1>Create new Creator Token</h1>
<NewProfile
  formId={currAcc}
  mint={mint(profileContract, currAcc)}
  on:minted={(ev) => onSuccess(ev.detail)}
/>
