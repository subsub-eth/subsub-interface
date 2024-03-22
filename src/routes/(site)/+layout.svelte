<script lang="ts">
  import NavigationHeader from '../NavigationHeader.svelte';
  import { Button } from '$lib/components/ui/button';
  import { getPreferredNetwork } from '$lib/network-switch';

  const preferredNetwork = getPreferredNetwork();
</script>

<NavigationHeader>
  <Button variant="default" href={`/${preferredNetwork}`}>go to app</Button>
</NavigationHeader>

<slot />
