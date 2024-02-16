<script lang="ts" context="module">
  import { SubscriptionContractDetails } from '$lib/components/subscription/contract';
  import type { SubscriptionContractData } from '$lib/web3/contracts/subscription';
  import { contractDummy } from '$lib/static-content';
  import { zeroAddress } from '$lib/web3/helpers';

  const testData: SubscriptionContractData = {
    name: 'Tier 1 Sub to Jane',
    description: 'This awesome subscription gives you access to nothing',
    image: contractDummy,
    externalUrl: 'http://example.com',
    address: zeroAddress,
    token: zeroAddress,
    rate: 100,
    lock: 112,
    epochSize: 3600,
    maxSupply: 10000,
    totalSupply: 500,
    activeShares: 60000,
    owner: zeroAddress,
    claimable: 30000,
    depositsClaimed: 700000,
    tipsClaimed: 800000,
    mintingPaused: false,
    renewalPaused: false,
    tippingPaused: false
  };

  export const meta = {
    title: 'SubscriptionContractDetails',
    component: SubscriptionContractDetails,
    tags: ['autodocs'],
    args: {
      contractData: testData
    },
    argTypes: {},
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
  import { setContext } from 'svelte';
  import { EXPLORER_URL } from '$lib/contexts';
  import QueryClientContext from '$lib/components/context/QueryClientContext.svelte';

  setContext(EXPLORER_URL, 'http://example.com');
</script>

<QueryClientContext>
  <Template let:args>
    <SubscriptionContractDetails {...args} />
  </Template>

  <Story name="technicals open" args={{ technicalsOpen: true }} />
  <Story name="technicals closed" args={{}} />

  <Story name="paused" args={{ contractData: { ...testData, paused: true } }} />
</QueryClientContext>
