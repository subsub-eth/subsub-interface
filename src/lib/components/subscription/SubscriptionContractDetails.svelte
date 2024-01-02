<script lang="ts">
  import type { SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';
  import * as Card from '$lib/components/ui/card';
  import * as Collapsible from '$lib/components/ui/collapsible';
  import TokenLogo from '../TokenLogo.svelte';
  import {
    ChevronLeft,
    ChevronsUpDown,
    ChevronsDownUp,
    DollarSign,
    ExternalLink,
    Activity,
    Users,
    Lock,
    Link
  } from 'lucide-svelte';
  import PropertyBox from '$lib/components/PropertyBox.svelte';
  import DetailsProperty from '$lib/components/DetailsProperty.svelte';
  import { Button } from '../ui/button';
  import Url from '../Url.svelte';

  /** Address of the subscription contract */
  export let address: string;

  /** Metadata of the subscription contract */
  export let metadata: SubscriptionContractMetadata;

  /** open the technical details collapsible */
  export let technicalsOpen = false;

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
            <div>
              <!--TODO extract url -->
              <Button variant="link" target="_blank" href={metadata.external_url}>
                <Link class="mr-2 h-4 w-4" />
                External URL
              </Button>
            </div>
          </div>
        {/if}
      </Card.Content>
    </Card.Root>
  {/if}

  <Card.Root class="mt-4">
    <Collapsible.Root bind:open={technicalsOpen}>
      <Card.Header>
        <Collapsible.Trigger class="flex justify-between">
          <Card.Title class="flex-none">Technical Details</Card.Title>
          {#if technicalsOpen}
            <ChevronsDownUp className="h-4 w-4 flex-none" />
          {:else}
            <ChevronsUpDown className="h-4 w-4 flex-none" />
          {/if}
        </Collapsible.Trigger>
      </Card.Header>
      <Collapsible.Content>
        <Card.Content>
          <DetailsProperty title="Address" help="The address of this contract">
            <div slot="value" class="flex items-center gap-2">
              <div>
                {metadata.token}
              </div>
              <Button
                variant="link"
                target="_blank"
                href={'https://example.com/' + address}
                class="h-0 px-0 py-0"
              >
                <ExternalLink class="h-4 w-4" />
              </Button>
            </div>
          </DetailsProperty>
          <DetailsProperty title="Token" help="The address of the payment token">
            <div slot="value" class="flex items-center gap-2">
              <div>
                {metadata.token}
              </div>
              <Button
                variant="link"
                target="_blank"
                href={'https://example.com/' + metadata.token}
                class="h-0 px-0 py-0"
              >
                <ExternalLink class="h-4 w-4" />
              </Button>
            </div>
          </DetailsProperty>
          <DetailsProperty
            title="Rate"
            value={metadata.rate + ''}
            help="The internal payment rate of token funds in gwei for a given time unit"
          />
          <DetailsProperty
            title="Lock"
            value={metadata.lock + ''}
            help="The internal representation (10000 == 100%) of the amount of funds getting locked in the contract on deposit"
          />
          <DetailsProperty
            title="Epoch Size"
            value={metadata.epochSize + ' Blocks'}
            help="The length of an epoch in time units"
          />
          <DetailsProperty
            title="Max Supply"
            value="TODO"
            help="The maximum supply of subscription tokens that can be minted"
          />
        </Card.Content>
      </Collapsible.Content>
    </Collapsible.Root>
  </Card.Root>
</div>
