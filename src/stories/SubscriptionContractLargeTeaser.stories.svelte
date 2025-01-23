<script lang="ts" module>
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import { type Props } from '$lib/components/subscription/contract/large-teaser.svelte';
  import { SubscriptionContractLargeTeaser } from '$lib/components/subscription/contract';
  import type { SubscriptionContractData } from '$lib/web3/contracts/subscription';
  import { zeroAddress } from '$lib/web3/helpers';

  // @ts-expect-error not implementing all props
  const testData: SubscriptionContractData = {
    name: 'Tier 1 Sub to Jane',
    description: 'This awesome subscription gives you access to nothing',
    image: 'https://picsum.photos/800/600',
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

  const ensOwner: Pick<ObservedQueryResult<OwnerData | null>, 'isSuccess' | 'data'> = {
    isSuccess: true,
    data: 'somebody.eth'
  };

  const profileOwner: Pick<ObservedQueryResult<OwnerData | null>, 'isSuccess' | 'data'> = {
    isSuccess: true,
    /* @ts-expect-error partially implemented */
    data: { name: 'Profile Owner' }
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
    title: 'SubscriptionContractLargeTeaser',
    component: SubscriptionContractLargeTeaser,
    tags: ['autodocs'],
    args: {
      contractData: testData,
      paymentTokenData: erc20,
      /* @ts-expect-error partially implemented */
      tokenPrice: tokenPrice,
      /* @ts-expect-error partially implemented */
      warnings: warnings
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
  });
</script>

<script lang="ts">
  import type { Price } from '$lib/web3/contracts/oracle';
  import type { Erc20Data } from '$lib/web3/contracts/erc20';
  import QueryClientContext from '$lib/components/context/QueryClientContext.svelte';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import type { ObservedQueryResult } from '$lib/query/config';
  import type { WarningMessage } from '$lib/web3/contracts/subscription-analytics';
  import { createMessages } from './fixtures';
  import { type Component } from 'svelte';
  import type { OwnerData } from '$lib/web3/contracts/profile';

  // @ts-expect-error load function might be undefined due to Partial
  setTemplate<Component<Props>>(template);
</script>

{#snippet template(args: Props)}
  <QueryClientContext>
    <Tooltip.Provider>
      <SubscriptionContractLargeTeaser {...args} />
    </Tooltip.Provider>
  </QueryClientContext>
{/snippet}

<Story name="Default" />

<Story
  name="Lengthy image"
  args={{ contractData: { ...testData, image: 'https://picsum.photos/300/800' } }}
/>

{/* @ts-expect-error partial type */ null}
<Story name="ENS Owner" args={{ owner: ensOwner }} />

{/* @ts-expect-error partial type */ null}
<Story name="Profile Owner" args={{ owner: profileOwner }} />
