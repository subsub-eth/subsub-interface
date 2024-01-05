<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { ChevronRight } from 'lucide-svelte';
  import type { ProfileTokenMetadata } from '$lib/web3/contracts/profile';
  import Url from '$lib/components/Url.svelte';

  /** Token id of the profile */
  export let id: bigint;

  /** Profile token metadata */
  export let metadata: ProfileTokenMetadata;
</script>

<Card.Root class="flex flex-row p-4">
  <Avatar.Root class="mr-4 h-16 w-16">
    <Avatar.Image src={metadata.image} alt={metadata.name} />
    <!-- TODO -->
    <Avatar.Fallback>{metadata.name}</Avatar.Fallback>
  </Avatar.Root>
  <div class="col-auto space-y-1.5 self-center justify-self-start">
    <Card.Title>{metadata.name}</Card.Title>
    {#if metadata.description}
      <Card.Description>{metadata.description}</Card.Description>
    {/if}
  </div>
  <Url template={`/[network]/p/${id}/`} let:path>
    <Button href={path} size="icon" class="ml-auto self-center justify-self-end">
      <ChevronRight className="h-4 w-4" />
    </Button>
  </Url>
</Card.Root>
