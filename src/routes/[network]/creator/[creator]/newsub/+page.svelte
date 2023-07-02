<script lang="ts">
  import { page } from '$app/stores';
  import NewSubscriptionContractForm from '$lib/components/subscription-manager/NewSubscriptionContractForm.svelte';
</script>

<a href={`${$page.url.pathname}../`}>back</a>
<h1>New Subscription Contract</h1>

<NewSubscriptionContractForm />
