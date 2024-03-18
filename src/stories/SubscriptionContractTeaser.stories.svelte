<script lang="ts" context="module">
  import { SubscriptionContractTeaser } from '$lib/components/subscription/contract';
  import type { SubscriptionContractData } from '$lib/web3/contracts/subscription';
  import { contractDummy } from '$lib/static-content';
  import { zeroAddress } from '$lib/web3/helpers';

  const testData: SubscriptionContractData = {
    name: 'Tier 1 Sub to Jane',
    description: 'This awesome subscription gives you access to nothing',
    image: contractDummy,
    externalUrl: 'http://example.com',
    token: zeroAddress,
    rate: 500_000_000_000,
    lock: 100,
    epochSize: 3600,
    claimable: 30000,
    address: zeroAddress,
    maxSupply: 10_000,
    totalSupply: 100,
    activeShares: 3300,
    owner: zeroAddress,
    depositsClaimed: 200,
    tipsClaimed: 400,
    mintingPaused: false,
    renewalPaused: false,
    tippingPaused: false
  };

  const erc20: Erc20Data = {
    name: 'Some Token',
    symbol: 'testUSD',
    decimals: 6,
    address: zeroAddress
  };

  const tokenPrice: Pick<ObservedQueryResult<Price | null>, 'isSuccess' | 'data'> = {
    isSuccess: true,
    data: { price: 99_000_000, decimals: 8 }
  };

  export const meta = {
    title: 'SubscriptionContractTeaser',
    component: SubscriptionContractTeaser,
    tags: ['autodocs'],
    args: {
      contractData: testData,
      paymentTokenData: erc20,
      tokenPrice: tokenPrice
    },
    parameters: {
      sveltekit_experimental: {
        stores: {
          page: {
            params: {
              network: 'mytest'
            }
          }
        }
      }
    }
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import type { Price } from '$lib/web3/contracts/oracle';
  import type { Erc20Data } from '$lib/web3/contracts/erc20';
  import QueryClientContext from '$lib/components/context/QueryClientContext.svelte';
  import type { ObservedQueryResult } from '$lib/query/config';
</script>

<QueryClientContext>
  <Template let:args>
    <SubscriptionContractTeaser {...args} />
  </Template>

  <Story name="with Owner" args={{ showOwner: true }} />

  <Story name="paused" args={{ contractData: { ...testData, mintingPaused: true } }} />

  <Story name="pending price data" args={{ tokenPrice: {isPending: true}}} />

  <Story name="error price data" args={{ tokenPrice: {isError: true}}} />
</QueryClientContext>
