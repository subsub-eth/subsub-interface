<script lang="ts" module>
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import { SubscriptionTeaser } from '$lib/components/subscription/token';
  import { type Props } from '$lib/components/subscription/token/teaser.svelte';
  import type { Erc20Data } from '$lib/web3/contracts/erc20';
  import type { SubscriptionData } from '$lib/web3/contracts/subscription';
  import { zeroAddress } from '$lib/web3/helpers';

  const subData: SubscriptionData = {
    tokenId: 10,
    address: zeroAddress,
    name: 'Sub #1',
    description: 'Something',
    image: undefined,
    externalUrl: undefined,
    deposited: 0,
    spent: 0,
    unspent: 9_000_000,
    withdrawable: 0,
    tips: 0,
    isActive: true,
    expiresAt: Math.floor(Date.now() / 1000 + 20 * 60 * 60 * 24 /** day */ + 60 * 60),
    multiplier: 100
  };

  const erc20: Erc20Data = {
    name: 'Some Token',
    symbol: 'testUSD',
    decimals: 6,
    address: zeroAddress
  };

  const { Story } = defineMeta({
    title: 'SubscriptionTeaser',
    component: SubscriptionTeaser,
    tags: ['autodocs'],
    args: {
      subscriptionData: subData,
      rate: 5_000_000_000_000,
      paymentToken: erc20
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
  import * as Tooltip from '$lib/components/ui/tooltip';

  // @ts-expect-error load function might be undefined due to Partial
  setTemplate(template);
</script>

{#snippet template(args: Props)}
  <Tooltip.Provider>
    <SubscriptionTeaser {...args} />
  </Tooltip.Provider>
{/snippet}

<Story name="Default" />

<Story
  name="Is inactive"
  args={{ subscriptionData: { ...subData, unspent: 0, isActive: false } }}
/>

<Story
  name="Large Numbers"
  args={{
    rate: 50,
    subscriptionData: {
      ...subData,
      unspent: '9000000000000000000000000000000',
      expiresAt: Math.floor(
        Date.now() / 1000 + 20_000_000_000_000 * 60 * 60 * 24 /** day */ + 60 * 60
      )
    }
  }}
/>

<Story
  name="Small Numbers"
  args={{
    rate: '5',
    subscriptionData: { ...subData, unspent: '9', expiresAt: Math.floor(Date.now() / 1000 + 4) },
    paymentToken: { ...erc20, decimals: 18 }
  }}
/>
