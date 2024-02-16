<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import TokenLogo from '$lib/components/TokenLogo.svelte';
  import { DollarSign, ExternalLink, Activity, Users, Lock, Link } from 'lucide-svelte';
  import PropertyBox from '$lib/components/ui/PropertyBox.svelte';
  import DetailsProperty from '$lib/components/ui/DetailsProperty.svelte';
  import { Button } from '$lib/components/ui/button';
  import CollapsibleBox from '$lib/components/ui/CollapsibleBox.svelte';
  import Paused from '$lib/components/subscription/Paused.svelte';
  import Warning from '$lib/components/subscription/Warning.svelte';
  import { ExplorerAccountUrl } from '$lib/components/url';
  import { ExplorerTokenUrl } from '$lib/components/url/explorer';
  import Base from './base.svelte';
  import type { Props } from './base.svelte';

  type $$Props = Props;

  /**
   * Data of the subscription plan
   */
  export let contractData: $$Props['contractData'];

  /**
   * Payment token data
   */
  export let paymentTokenData: $$Props['paymentTokenData'];

  /**
   *  Function to load price data for the underlying erc20 token from
   */
  export let getPriceData: $$Props['getPriceData'];

  /** open the technical details collapsible */
  export let technicalsOpen = false;

  // TODO
  const tokenSymbol = 'USDT';
</script>

<Base
  {contractData}
  {paymentTokenData}
  {getPriceData}
  let:price
  let:rate
  let:rawRate
  let:totalSupply
  let:activeSubs
  let:ratePrice
>
  <div class="p-4 text-foreground">
    <!-- header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <TokenLogo class="mr-4" address={contractData.token} fallbackSymbol={tokenSymbol} />
        <div>
          <h2>{contractData.name}</h2>
        </div>
      </div>
      <div class="flex items-center gap-2">
        {#if contractData.mintingPaused}
          <Paused />
        {/if}
        <!-- TODO -->
        <Warning text="Contract is not monitored" />
      </div>
    </div>
    <!-- Main Properties -->
    <div class="grid gap-4 pt-4 sm:grid-cols-2 md:grid-cols-4">
      <PropertyBox title="Moneys" titleLogo={DollarSign} value="20$ per Month" />
      <PropertyBox title="Active Subs" titleLogo={Activity} value={String(activeSubs)} />
      <PropertyBox title="Total Subs" titleLogo={Users} value={String(totalSupply)} />
      <PropertyBox title="Lockup" titleLogo={Lock} value={`${contractData.lock / 100}%`} />
    </div>
    <!-- Description -->
    {#if contractData.image || contractData.description || contractData.externalUrl}
      <Card.Root class="mt-4 pt-2">
        <Card.Header>
          <Card.Title>Details</Card.Title>
        </Card.Header>
        <Card.Content>
          {#if contractData.image || contractData.description}
            <div class="flex items-center gap-2 pt-2">
              {#if contractData.image}
                <div class="max-h-50 max-w-50 flex-initial basis-1/4">
                  <img src={contractData.image} alt={contractData.name} />
                </div>
              {/if}
              {#if contractData.description}
                <div class="basis-3/4">
                  <p>{contractData.description}</p>
                </div>
              {/if}
            </div>
          {/if}
          {#if contractData.externalUrl}
            <div class="flex items-center gap-2 pt-2">
              <div>
                <!--TODO extract url -->
                <Button variant="link" target="_blank" href={contractData.externalUrl}>
                  <Link class="mr-2 h-4 w-4" />
                  External URL
                </Button>
              </div>
            </div>
          {/if}
        </Card.Content>
      </Card.Root>
    {/if}

    <!-- TODO claim, tips and spent -->

    <CollapsibleBox rootClass="mt-4" title="Technical Details" open={technicalsOpen}>
      <DetailsProperty title="Address" help="The address of this contract">
        <div slot="value" class="flex items-center gap-2">
          <div>
            {contractData.address}
          </div>
          <ExplorerAccountUrl address={contractData.address} let:url>
            <Button variant="link" target="_blank" href={url} class="h-0 px-0 py-0">
              <ExternalLink class="h-4 w-4" />
            </Button>
          </ExplorerAccountUrl>
        </div>
      </DetailsProperty>
      <DetailsProperty title="Token" help="The address of the payment token">
        <div slot="value" class="flex items-center gap-2">
          <div>
            {contractData.token}
          </div>
          <ExplorerTokenUrl contract={contractData.token} let:url>
            <Button variant="link" target="_blank" href={url} class="h-0 px-0 py-0">
              <ExternalLink class="h-4 w-4" />
            </Button>
          </ExplorerTokenUrl>
        </div>
      </DetailsProperty>
      <DetailsProperty
        title="Rate"
        value={contractData.rate + ''}
        help="The internal payment rate of token funds in gwei for a given time unit"
      />
      <DetailsProperty
        title="Lock"
        value={contractData.lock + ''}
        help="The internal representation (10000 == 100%) of the amount of funds getting locked in the contract on deposit"
      />
      <DetailsProperty
        title="Epoch Size"
        value={contractData.epochSize + ' Blocks'}
        help="The length of an epoch in time units"
      />
      <DetailsProperty
        title="Max Supply"
        value={contractData.maxSupply + ''}
        help="The maximum supply of subscription tokens that can be minted"
      />
    </CollapsibleBox>
  </div>
</Base>
