<script lang="ts" module>
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import { SubscriptionContractDetails } from '$lib/components/subscription/contract';
  import { type Props } from '$lib/components/subscription/contract/details.svelte';
  import type { SubscriptionContractData } from '$lib/web3/contracts/subscription';
  import { contractDummy } from '$lib/static-content';
  import { zeroAddress } from '$lib/web3/helpers';

  const descriptionMd = `## Hello World

this is some text

 * bullet 1
 * bullet 2

 1. numbered 1
 1. numbered 2


some more text
`;

  // @ts-expect-error partial type
  const testData: SubscriptionContractData = {
    name: 'Tier 1 Sub to Jane',
    description: descriptionMd,
    image: contractDummy,
    externalUrl: 'http://example.com',
    address: zeroAddress,
    token: zeroAddress,
    rate: 500_000_000_000,
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

  const warnings: Pick<
    ObservedQueryResult<Array<WarningMessage>>,
    'isSuccess' | 'isPending' | 'data'
  > = {
    isSuccess: true,
    isPending: false,
    data: createMessages(1, 2, 3)
  };

  const { Story } = defineMeta({
    title: 'SubscriptionContractDetails',
    component: SubscriptionContractDetails,
    tags: ['autodocs'],
    args: {
      contractData: testData,
      paymentTokenData: erc20,
      contractBalance: 100_000_000_000,
      // @ts-expect-error partial type
      tokenPrice: tokenPrice,
      // @ts-expect-error partial type
      warnings: warnings
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
  });
</script>

<script lang="ts">
  import { setContext } from 'svelte';
  import { EXPLORER_URL } from '$lib/contexts';
  import QueryClientContext from '$lib/components/context/QueryClientContext.svelte';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import type { Erc20Data } from '$lib/web3/contracts/erc20';
  import type { ObservedQueryResult } from '$lib/query/config';
  import type { Price } from '$lib/web3/contracts/oracle';
  import type { WarningMessage } from '$lib/web3/contracts/subscription-analytics';
  import { createMessages } from './fixtures';

  setContext(EXPLORER_URL, 'http://example.com');

  // @ts-expect-error load function might be undefined due to Partial
  setTemplate(template);
</script>

{#snippet template(args: Props)}
  <QueryClientContext>
    <Tooltip.Provider>
      <SubscriptionContractDetails {...args} />
    </Tooltip.Provider>
  </QueryClientContext>
{/snippet}

<Story name="Default" />

<Story name="technicals open" args={{ technicalsOpen: true }} />
<Story name="technicals closed" args={{}} />

{/* @ts-expect-error partial type */ null}
<Story name="paused" args={{ contractData: { ...testData, paused: true } }} />

{/* @ts-expect-error partial type */ null}
<Story name="pending price data" args={{ tokenPrice: { isPending: true } }} />

{/* @ts-expect-error partial type */ null}
<Story name="error price data" args={{ tokenPrice: { isError: true } }} />
