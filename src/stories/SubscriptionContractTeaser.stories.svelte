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
    rate: 100,
    lock: 100,
    epochSize: 3600,
    claimable: 30000,
    address: zeroAddress,
    maxSupply: 10_000,
    totalSupply: 100,
    activeShares: 1000,
    owner: zeroAddress,
    depositsClaimed: 200,
    tipsClaimed: 400,
    mintingPaused: false,
    renewalPaused: false,
    tippingPaused: false
  };

  const getErc20 = async (addr: Address): Promise<Erc20Data> => {
    return {
      name: 'Test Token',
      symbol: 'TT',
      decimals: 18,
      address: addr
    };
  };
  const getPriceData = async (addr: Address): Promise<Price> => {
    return { price: 12n * 10n ** 7n, decimals: 8 };
  };

  export const meta = {
    title: 'SubscriptionContractTeaser',
    component: SubscriptionContractTeaser,
    tags: ['autodocs'],
    args: {
      contractData: testData,
      getErc20Data: getErc20,
      getPriceData: getPriceData
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
  import type { Address } from '$lib/web3/contracts/common';
  import type { Price } from '$lib/web3/contracts/oracle';
  import type { Erc20Data } from '$lib/web3/contracts/erc20';
  import QueryClientContext from '$lib/components/context/QueryClientContext.svelte';
</script>

<QueryClientContext>
  <Template let:args>
    <SubscriptionContractTeaser {...args} {getPriceData} getErc20Data={getErc20} />
  </Template>

  <Story name="with Owner" args={{ showOwner: true }} />

  <Story name="paused" args={{ contractData: { ...testData, mintingPaused: true } }} />
</QueryClientContext>
