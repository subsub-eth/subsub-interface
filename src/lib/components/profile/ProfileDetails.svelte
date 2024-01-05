<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import type { ProfileTokenMetadata } from '$lib/web3/contracts/profile';
  import { ClipboardCopy, ExternalLink } from 'lucide-svelte';

  /** Token id of the profile */
  export let id: bigint;

  /** Profile token metadata */
  export let metadata: ProfileTokenMetadata;
</script>

<Card.Root class="p-4">
  <div class="flex flex-row gap-x-4">
    <div class="basis-1/4">
      <Avatar.Root class="mr-4 h-auto w-full max-w-[120px]">
        <Avatar.Image src={metadata.image} alt={metadata.name} />
        <!-- TODO -->
        <Avatar.Fallback>{metadata.name}</Avatar.Fallback>
      </Avatar.Root>
    </div>
    <div class="basis-3/4 space-y-3 self-center justify-self-start">
      <div class="flex">
        <Card.Title>{metadata.name}</Card.Title>
        <Button size="iconSm" variant="ghost" class="ml-auto self-center justify-self-end">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
      {#if metadata.description}
        <Card.Description>{metadata.description}</Card.Description>
      {/if}
    </div>
  </div>
  <div class="mt-2">
    <div class="flex flex-row items-center gap-x-4">
      <div class="basis-1/4 text-sm font-medium">External Link:</div>
      <Button variant="link" class="basis-3/4 justify-start truncate p-0">
        <span class="overflow-hidden truncate">{metadata.external_url}</span>
      </Button>
    </div>
    <div class="flex flex-row items-center gap-x-4">
      <div class="basis-1/4 text-sm font-medium">Owner:</div>
      <p class="flex basis-3/4 flex-row justify-start text-sm font-medium">
        <span>{metadata.owner}</span>
        <Button size="iconSm" variant="ghost" class="ml-2 self-center">
          <ClipboardCopy className="h-4 w-4" />
        </Button>
        <Button size="iconSm" variant="ghost" class="ml-2 self-center">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </p>
    </div>
  </div>
</Card.Root>
