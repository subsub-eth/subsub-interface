<script lang="ts">
  import type { SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';
  import * as Card from '$lib/components/ui/card';
  import * as Collapsible from '$lib/components/ui/collapsible';
  import TokenLogo from '../TokenLogo.svelte';
  import Url from '../Url.svelte';
  import {
    ChevronLeft,
    ChevronsUpDown,
    DollarSign,
    Activity,
    Users,
    Lock,
    Link
  } from 'lucide-svelte';
  import PropertyBox from '$lib/components/PropertyBox.svelte';

  /** Address of the subscription contract */
  export let address: string;

  /** Metadata of the subscription contract */
  export let metadata: SubscriptionContractMetadata;

  // TODO
  const tokenSymbol = 'USDT';
  const ownerName = 'Jane';
</script>

<div class="p-4 text-foreground">
  <!-- "back link" to profile -->
  <Url template={`/[network]/p/${metadata.ownerAddress}/`} let:path>
    <a href={path}>
      <div class="flex items-center gap-1">
        <ChevronLeft className="h-4 w-4" /> <span>{ownerName}'s profile</span>
      </div>
    </a>
  </Url>
  <!-- header -->
  <div class="flex items-center gap-2 pt-2">
    <TokenLogo address={metadata.token} fallbackSymbol={tokenSymbol} />
    <div>
      <h2>{metadata.name}</h2>
    </div>
  </div>
  <!-- Main Properties -->
  <div class="grid gap-4 pt-4 sm:grid-cols-2 md:grid-cols-4">
    <PropertyBox title="Moneys" titleLogo={DollarSign} value="20$ per Month" />
    <PropertyBox title="Active Subs" titleLogo={Activity} value="200" />
    <PropertyBox title="Total Subs" titleLogo={Users} value="3000" />
    <PropertyBox title="Lockup" titleLogo={Lock} value="10%" />
  </div>
  <!-- Description -->
  {#if metadata.image || metadata.description || metadata.external_url}
    <Card.Root class="mt-4 pt-2">
      <Card.Header>
        <Card.Title>Details</Card.Title>
      </Card.Header>
      <Card.Content>
        {#if metadata.image || metadata.description}
          <div class="flex items-center gap-2 pt-2">
            {#if metadata.image}
              <div class="max-h-50 max-w-50 flex-initial basis-1/4">
                <img src={metadata.image} alt={metadata.name} />
              </div>
            {/if}
            {#if metadata.description}
              <div class="basis-3/4">
                <p>{metadata.description}</p>
              </div>
            {/if}
          </div>
        {/if}
        {#if metadata.external_url}
          <div class="flex items-center gap-2 pt-2">
            <Link className="h-4 w-4" />
            <div>
              <!--TODO extract url -->
              <a href={metadata.external_url}>External URL</a>
            </div>
          </div>
        {/if}
      </Card.Content>
    </Card.Root>
  {/if}

  <Card.Root class="mt-4">
    <Collapsible.Root>
      <Card.Header>
        <Collapsible.Trigger class="flex justify-between">
          <Card.Title class="flex-none">Technical Details</Card.Title>
          <ChevronsUpDown className="h-4 w-4 flex-none" />
        </Collapsible.Trigger>
      </Card.Header>
      <Collapsible.Content>
        <Card.Content>
          <div>address: {address}</div>
          <div>
            token: {metadata.token}
          </div>
          <div>
            rate: {metadata.rate}
          </div>
        </Card.Content>
      </Collapsible.Content>
    </Collapsible.Root>
  </Card.Root>
</div>
