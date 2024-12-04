<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { ChevronRight } from 'lucide-svelte';
  import type { ProfileData } from '$lib/web3/contracts/profile';
  import { url } from '$lib/url.svelte';

  interface Props {
    /** profile data */
    profile: ProfileData;
  }

  let { profile }: Props = $props();
</script>

<Card.Root class="flex flex-row p-4">
  <Avatar.Root class="mr-4 h-16 w-16">
    <Avatar.Image src={profile.image} alt={profile.name} />
    <!-- TODO -->
    <Avatar.Fallback>{profile.name}</Avatar.Fallback>
  </Avatar.Root>
  <div class="col-auto space-y-1.5 self-center justify-self-start">
    <Card.Title>{profile.name}</Card.Title>
    {#if profile.description}
      <Card.Description>{profile.description}</Card.Description>
    {/if}
  </div>
  <Button
    href={url(`/[network]/p/${profile.tokenId}/`)}
    size="icon"
    class="ml-auto self-center justify-self-end"
  >
    <ChevronRight className="h-4 w-4" />
  </Button>
</Card.Root>
